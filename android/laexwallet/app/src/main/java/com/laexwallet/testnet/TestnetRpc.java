package com.laexwallet.testnet;

import org.json.JSONArray;
import org.json.JSONObject;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/** Fixed HTTPS endpoint. Never accepts an RPC URL or chain ID from a web page or user. */
public final class TestnetRpc {
    public interface Transport { Object call(String method,JSONArray params)throws Exception; }
    private final Transport transport;
    public TestnetRpc(){this(new HttpTransport());}
    public TestnetRpc(Transport transport){this.transport=transport;}
    public void checkChain()throws Exception{
        if(!hex(transport.call("eth_chainId",new JSONArray())).equals(BigInteger.valueOf(WalletCore.CHAIN_ID)))throw new IllegalStateException("La conexión no responde como BNB testnet (97). Operación bloqueada.");
    }
    private static BigInteger hex(Object value){String s=String.valueOf(value);if(!s.matches("0x[0-9a-fA-F]+"))throw new IllegalArgumentException("Respuesta de red inválida.");return new BigInteger(s.substring(2),16);}
    public BigInteger balance(String address)throws Exception{checkChain();return hex(transport.call("eth_getBalance",new JSONArray().put(address).put("latest")));}
    private BigInteger pendingNonce(String address)throws Exception{return hex(transport.call("eth_getTransactionCount",new JSONArray().put(address).put("pending")));}
    public WalletCore.Draft prepare(String from,String inputTo,String inputValue)throws Exception{
        checkChain();String to=WalletCore.validAddress(inputTo);BigInteger value=WalletCore.amount(inputValue);
        if(from.equalsIgnoreCase(to))throw new IllegalArgumentException("Usa otra cuenta de prueba como destinatario.");
        Object code=transport.call("eth_getCode",new JSONArray().put(to).put("latest"));
        if(!"0x".equals(code))throw new IllegalArgumentException("Esta primera versión solo envía a cuentas normales, no a contratos.");
        BigInteger gasPrice=hex(transport.call("eth_gasPrice",new JSONArray()));
        if(gasPrice.signum()<=0||gasPrice.compareTo(BigInteger.valueOf(100_000_000_000L))>0)throw new IllegalArgumentException("Comisión fuera del límite de este piloto. Prueba más tarde.");
        BigInteger estimate=hex(transport.call("eth_estimateGas",new JSONArray().put(new JSONObject().put("from",from).put("to",to).put("value","0x"+value.toString(16)))));
        if(estimate.compareTo(WalletCore.GAS_LIMIT)>0)throw new IllegalArgumentException("Esta operación requiere más gas del admitido por el piloto.");
        WalletCore.Draft draft=new WalletCore.Draft(from,to,value,pendingNonce(from),gasPrice,System.currentTimeMillis());
        if(balance(from).compareTo(draft.total())<0)throw new IllegalArgumentException("Falta tBNB para cubrir el importe y la comisión.");
        return draft;
    }
    public void revalidate(WalletCore.Draft draft)throws Exception{
        checkChain();
        if(System.currentTimeMillis()-draft.createdAt()>120000)throw new IllegalArgumentException("La revisión caducó. Vuelve a preparar el envío.");
        if(!pendingNonce(draft.from()).equals(draft.nonce()))throw new IllegalArgumentException("La cuenta tiene otro movimiento. Revisa otra vez el envío.");
        if(!"0x".equals(transport.call("eth_getCode",new JSONArray().put(draft.to()).put("latest"))))throw new IllegalArgumentException("El destino cambió; no se enviará.");
        if(hex(transport.call("eth_gasPrice",new JSONArray())).compareTo(draft.gasPrice())>0)throw new IllegalArgumentException("La comisión subió. Revisa de nuevo el envío.");
        if(balance(draft.from()).compareTo(draft.total())<0)throw new IllegalArgumentException("El saldo cambió. Revisa el envío.");
    }
    public void broadcast(String raw,String expectedHash)throws Exception{
        checkChain();Object result=transport.call("eth_sendRawTransaction",new JSONArray().put(raw));
        if(!expectedHash.equalsIgnoreCase(String.valueOf(result)))throw new IllegalStateException("La respuesta no coincide con el hash local. Comprueba el historial antes de volver a enviar.");
    }
    public String status(String hash)throws Exception{
        checkChain();Object result=transport.call("eth_getTransactionReceipt",new JSONArray().put(hash));
        if(result==null||result==JSONObject.NULL)return "Pendiente: todavía no hay recibo";
        JSONObject receipt=(JSONObject)result;
        if(!hash.equalsIgnoreCase(receipt.optString("transactionHash")))throw new IllegalArgumentException("Recibo inesperado.");
        if("0x0".equals(receipt.optString("status")))return "Fallida en la red";
        if(!"0x1".equals(receipt.optString("status")))return "Pendiente de comprobar estado";
        BigInteger confirmations=hex(transport.call("eth_blockNumber",new JSONArray())).subtract(hex(receipt.get("blockNumber"))).add(BigInteger.ONE);
        return confirmations.compareTo(BigInteger.valueOf(3))>=0?"Confirmada (3 o más bloques)":"Pendiente: "+confirmations+" confirmaciones";
    }
    private static final class HttpTransport implements Transport {
        public Object call(String method,JSONArray params)throws Exception{
            HttpURLConnection connection=(HttpURLConnection)new URL(WalletCore.RPC).openConnection();
            connection.setInstanceFollowRedirects(false);connection.setRequestMethod("POST");connection.setConnectTimeout(10000);connection.setReadTimeout(15000);connection.setDoOutput(true);connection.setRequestProperty("Content-Type","application/json");
            try{
                byte[] body=new JSONObject().put("jsonrpc","2.0").put("id",1).put("method",method).put("params",params).toString().getBytes(StandardCharsets.UTF_8);
                try(var out=connection.getOutputStream()){out.write(body);}
                if(connection.getResponseCode()!=200)throw new IllegalStateException("La red no está disponible. Inténtalo de nuevo más tarde.");
                byte[] bytes;try(var in=connection.getInputStream();var buffer=new java.io.ByteArrayOutputStream()){byte[] chunk=new byte[8192];int count;while((count=in.read(chunk))!=-1){if(buffer.size()+count>1_000_000)throw new IllegalStateException("Respuesta de red demasiado grande.");buffer.write(chunk,0,count);}bytes=buffer.toByteArray();}
                if(bytes.length>1_000_000)throw new IllegalStateException("Respuesta de red demasiado grande.");
                JSONObject reply=new JSONObject(new String(bytes,StandardCharsets.UTF_8));
                if(reply.has("error"))throw new IllegalStateException("La red rechazó la consulta. Revisa el estado antes de repetir un envío.");
                if(reply.optInt("id")!=1||!reply.has("result"))throw new IllegalStateException("Respuesta de red incompleta.");
                return reply.get("result");
            }finally{connection.disconnect();}
        }
    }
}
