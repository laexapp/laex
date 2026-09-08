package com.laexwallet.testnet;

import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.AtomicFile;
import java.io.File;
import java.io.FileOutputStream;
import java.security.KeyStore;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

/** AES keys stay in Android Keystore; v1 PIN-only wallets migrate atomically to v2. */
public final class LocalVault {
    private final AtomicFile file;
    public LocalVault(Context context){file=new AtomicFile(new File(context.getNoBackupFilesDir(),"wallet-testnet.vault"));}
    public boolean exists(){return file.getBaseFile().exists()||new File(file.getBaseFile().getPath()+".bak").exists();}
    private SecretKey key(int version,boolean create)throws Exception{
        if(version!=1&&version!=2)throw new IllegalArgumentException("Versión local inválida.");
        String alias="laexwallet.testnet.entropy.v"+version;
        KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
        if(!store.containsAlias(alias)){
            if(!create||version!=2)throw new IllegalStateException("La clave local no está disponible. Necesitarás tu respaldo de prueba.");
            KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
            generator.init(new KeyGenParameterSpec.Builder(alias,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256).setUserAuthenticationRequired(true)
                .setUserAuthenticationParameters(30,KeyProperties.AUTH_BIOMETRIC_STRONG|KeyProperties.AUTH_DEVICE_CREDENTIAL).build());
            return generator.generateKey();
        }
        return (SecretKey)store.getKey(alias,null);
    }
    /** Create the new protected key before showing the system authentication prompt. */
    public boolean prepareAuthentication()throws Exception{
        boolean legacy=exists()&&VaultEnvelope.version(file.readFully())==1;
        key(2,!exists()||legacy);
        return legacy;
    }
    public void migrateAfterPin()throws Exception{
        byte[] original=file.readFully();
        if(VaultEnvelope.version(original)==2)return;
        VaultUpgrade.migrate(original,key(1,false),key(2,false),this::writeAtomic);
    }
    private void writeAtomic(byte[] encrypted)throws Exception{
        FileOutputStream out=null;
        try{out=file.startWrite();out.write(encrypted);file.finishWrite(out);}
        catch(Exception error){if(out!=null)file.failWrite(out);throw error;}
    }
    public void save(byte[] entropy)throws Exception{
        if(exists())throw new IllegalStateException("Ya existe una wallet en este dispositivo. No se sobrescribirá.");
        writeAtomic(VaultEnvelope.encrypt(entropy,key(2,false),2));
    }
    public byte[] read()throws Exception{
        byte[] encrypted=file.readFully();
        return VaultEnvelope.decrypt(encrypted,key(VaultEnvelope.version(encrypted),false));
    }
}
