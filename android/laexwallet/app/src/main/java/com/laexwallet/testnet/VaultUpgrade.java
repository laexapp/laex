package com.laexwallet.testnet;

import java.util.Arrays;
import javax.crypto.SecretKey;

/** Keep the original file until the new envelope has passed authenticated decryption. */
final class VaultUpgrade {
    interface Commit { void write(byte[] encrypted)throws Exception; }
    static void migrate(byte[] original,SecretKey oldKey,SecretKey newKey,Commit commit)throws Exception {
        if(VaultEnvelope.version(original)!=1)throw new IllegalArgumentException("El respaldo no requiere esta actualización.");
        byte[] entropy=VaultEnvelope.decrypt(original,oldKey);
        try {
            byte[] encrypted=VaultEnvelope.encrypt(entropy,newKey,2);
            byte[] verified=VaultEnvelope.decrypt(encrypted,newKey);
            try {
                if(!Arrays.equals(entropy,verified))throw new IllegalStateException("No se pudo verificar la protección nueva.");
                commit.write(encrypted);
            } finally { Arrays.fill(verified,(byte)0); }
        } finally { Arrays.fill(entropy,(byte)0); }
    }
}
