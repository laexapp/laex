package com.laexwallet.testnet;

import org.junit.Test;
import org.json.JSONObject;
import java.math.BigInteger;
import java.util.ArrayList;
import static org.junit.Assert.*;

public class TestnetRpcTest {
    private final String from="0x9858EfFD232B4033E47d90003D41EC34EcaEda94",to="0x1111111111111111111111111111111111111111";
    @Test public void wrongNetworkFailsBeforeBalanceOrSigning(){
        ArrayList<String> calls=new ArrayList<>();TestnetRpc rpc=new TestnetRpc((method,params)->{calls.add(method);return "0x38";});
        assertThrows(IllegalStateException.class,()->rpc.balance(from));assertEquals(java.util.List.of("eth_chainId"),calls);
    }
    private TestnetRpc fake(String code,String balance){return new TestnetRpc((method,params)->switch(method){
        case "eth_chainId"->"0x61";case "eth_getCode"->code;case "eth_gasPrice"->"0xb2d05e00";case "eth_estimateGas"->"0x5208";case "eth_getBalance"->balance;case "eth_getTransactionCount"->"0x0";default->throw new IllegalArgumentException(method);
    });}
    @Test public void feesReservedAndContractsRejected()throws Exception{
        TestnetRpc rpc=fake("0x","0xde0b6b3a7640000");WalletCore.Draft draft=rpc.prepare(from,to,"0.01");assertEquals(new BigInteger("63000000000000"),draft.fee());rpc.revalidate(draft);
        assertThrows(IllegalArgumentException.class,()->fake("0x6000","0xde0b6b3a7640000").prepare(from,to,"0.01"));
        assertThrows(IllegalArgumentException.class,()->fake("0x","0x1").prepare(from,to,"0.01"));
        assertThrows(IllegalArgumentException.class,()->rpc.prepare(from,from,"0.01"));
    }
    @Test public void broadcastMustReturnLocalHashAndReceiptMustMatch()throws Exception{
        String hash="0x"+"a".repeat(64);
        TestnetRpc mismatch=new TestnetRpc((method,params)->method.equals("eth_chainId")?"0x61":"0x"+"b".repeat(64));
        assertThrows(IllegalStateException.class,()->mismatch.broadcast("0x1234",hash));
        TestnetRpc pending=new TestnetRpc((method,params)->method.equals("eth_chainId")?"0x61":JSONObject.NULL);
        assertTrue(pending.status(hash).startsWith("Pendiente"));
        TestnetRpc confirmed=new TestnetRpc((method,params)->switch(method){case "eth_chainId"->"0x61";case "eth_blockNumber"->"0xc";default->new JSONObject().put("transactionHash",hash).put("status","0x1").put("blockNumber","0xa");});
        assertEquals("Confirmada (3 o más bloques)",confirmed.status(hash));
    }
}
