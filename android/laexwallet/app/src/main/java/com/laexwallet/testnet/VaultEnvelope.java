package com.laexwallet.testnet;

import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/** Versioned authenticated encryption. Only the two fixed local-key policies exist. */
final class VaultEnvelope {
    static int version(byte[] encoded) throws Exception {
        int version=new JSONObject(new String(encoded,StandardCharsets.UTF_8)).getInt("v");
        if(version!=1&&version!=2)throw new IllegalStateException("Versión de respaldo local desconocida.");
        return version;
    }
    private static byte[] aad(int version) {
        if(version!=1&&version!=2)throw new IllegalArgumentException("Versión local inválida.");
        return ("laexwallet:testnet:97:v"+version).getBytes(StandardCharsets.UTF_8);
    }
    static byte[] encrypt(byte[] entropy,SecretKey key,int version)throws Exception {
        if(entropy.length!=16)throw new IllegalArgumentException("Datos locales inválidos.");
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE,key);cipher.updateAAD(aad(version));
        return new JSONObject().put("v",version)
            .put("iv",Base64.getEncoder().encodeToString(cipher.getIV()))
            .put("data",Base64.getEncoder().encodeToString(cipher.doFinal(entropy)))
            .toString().getBytes(StandardCharsets.UTF_8);
    }
    static byte[] decrypt(byte[] encoded,SecretKey key)throws Exception {
        int version=version(encoded);
        JSONObject data=new JSONObject(new String(encoded,StandardCharsets.UTF_8));
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE,key,new GCMParameterSpec(128,Base64.getDecoder().decode(data.getString("iv"))));
        cipher.updateAAD(aad(version));
        byte[] entropy=cipher.doFinal(Base64.getDecoder().decode(data.getString("data")));
        if(entropy.length!=16){java.util.Arrays.fill(entropy,(byte)0);throw new IllegalStateException("Datos locales inválidos.");}
        return entropy;
    }
}
