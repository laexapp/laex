package com.laexwallet.testnet;

import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.AtomicFile;
import android.util.Base64;
import org.json.JSONObject;
import java.io.File;
import java.io.FileOutputStream;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/** Encrypts entropy with a non-exportable AES key requiring recent device credentials. */
public final class LocalVault {
    private static final String ALIAS="laexwallet.testnet.entropy.v1";
    private static final byte[] AAD="laexwallet:testnet:97:v1".getBytes(java.nio.charset.StandardCharsets.UTF_8);
    private final AtomicFile file;
    public LocalVault(Context context){file=new AtomicFile(new File(context.getNoBackupFilesDir(),"wallet-testnet.vault"));}
    public boolean exists(){return file.getBaseFile().exists();}
    private SecretKey key(boolean create)throws Exception{
        KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
        if(!store.containsAlias(ALIAS)){
            if(!create)throw new IllegalStateException("La clave local no está disponible. Necesitarás tu respaldo de prueba.");
            KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
            generator.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256).setUserAuthenticationRequired(true)
                .setUserAuthenticationParameters(30,KeyProperties.AUTH_DEVICE_CREDENTIAL).build());
            return generator.generateKey();
        }
        return (SecretKey)store.getKey(ALIAS,null);
    }
    public void save(byte[] entropy)throws Exception{
        if(exists())throw new IllegalStateException("Ya existe una wallet en este dispositivo. No se sobrescribirá.");
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key(true));cipher.updateAAD(AAD);
        JSONObject data=new JSONObject().put("v",1).put("iv",Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)).put("data",Base64.encodeToString(cipher.doFinal(entropy),Base64.NO_WRAP));
        FileOutputStream out=null;
        try{out=file.startWrite();out.write(data.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));file.finishWrite(out);}
        catch(Exception error){if(out!=null)file.failWrite(out);throw error;}
    }
    public byte[] read()throws Exception{
        JSONObject data=new JSONObject(new String(file.readFully(),java.nio.charset.StandardCharsets.UTF_8));
        if(data.getInt("v")!=1)throw new IllegalStateException("Versión de respaldo local desconocida.");
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(false),new GCMParameterSpec(128,Base64.decode(data.getString("iv"),Base64.NO_WRAP)));cipher.updateAAD(AAD);
        byte[] entropy=cipher.doFinal(Base64.decode(data.getString("data"),Base64.NO_WRAP));
        if(entropy.length!=16)throw new IllegalStateException("Datos locales inválidos.");
        return entropy;
    }
}
