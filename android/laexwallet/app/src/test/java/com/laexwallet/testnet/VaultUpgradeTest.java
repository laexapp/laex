package com.laexwallet.testnet;

import org.junit.Test;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import static org.junit.Assert.*;

public class VaultUpgradeTest {
    // Public deterministic test material, never used by the application.
    private final SecretKey oldKey=new SecretKeySpec(new byte[32],"AES");
    private final SecretKey newKey=new SecretKeySpec(new byte[]{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16},"AES");
    @Test public void migrationPreservesExactRecoveryAndAddress()throws Exception{
        byte[] entropy=new byte[16];byte[] original=VaultEnvelope.encrypt(entropy,oldKey,1);
        AtomicReference<byte[]> stored=new AtomicReference<>(original);
        VaultUpgrade.migrate(original,oldKey,newKey,stored::set);
        assertEquals(2,VaultEnvelope.version(stored.get()));
        byte[] restored=VaultEnvelope.decrypt(stored.get(),newKey);
        assertArrayEquals(entropy,restored);
        assertEquals(WalletCore.address(entropy),WalletCore.address(restored));
        assertEquals(WalletCore.words(entropy),WalletCore.words(restored));
        assertArrayEquals(entropy,VaultEnvelope.decrypt(original,oldKey));
        assertThrows(Exception.class,()->VaultEnvelope.decrypt(stored.get(),oldKey));
    }
    @Test public void wrongOldKeyDoesNotTouchOriginal()throws Exception{
        byte[] original=VaultEnvelope.encrypt(new byte[16],oldKey,1);
        AtomicReference<byte[]> stored=new AtomicReference<>(original);
        assertThrows(Exception.class,()->VaultUpgrade.migrate(original,newKey,newKey,stored::set));
        assertSame(original,stored.get());
    }
    @Test public void failedCommitLeavesOldEnvelopeDecryptable()throws Exception{
        byte[] original=VaultEnvelope.encrypt(new byte[16],oldKey,1);
        assertThrows(java.io.IOException.class,()->VaultUpgrade.migrate(original,oldKey,newKey,value->{throw new java.io.IOException("disk full");}));
        assertArrayEquals(new byte[16],VaultEnvelope.decrypt(original,oldKey));
    }
    @Test public void changingPolicyHeaderWithoutReencryptionIsRejected()throws Exception{
        byte[] original=VaultEnvelope.encrypt(new byte[16],oldKey,1);
        byte[] modified=new JSONObject(new String(original,StandardCharsets.UTF_8)).put("v",2).toString().getBytes(StandardCharsets.UTF_8);
        assertThrows(Exception.class,()->VaultEnvelope.decrypt(modified,oldKey));
    }
    @Test public void corruptedCiphertextNeverCommits()throws Exception{
        byte[] original=VaultEnvelope.encrypt(new byte[16],oldKey,1);
        JSONObject object=new JSONObject(new String(original,StandardCharsets.UTF_8));
        byte[] cipher=java.util.Base64.getDecoder().decode(object.getString("data"));cipher[0]^=1;
        byte[] corrupted=object.put("data",java.util.Base64.getEncoder().encodeToString(cipher)).toString().getBytes(StandardCharsets.UTF_8);
        assertThrows(Exception.class,()->VaultUpgrade.migrate(corrupted,oldKey,newKey,value->fail("must not commit")));
    }
    @Test public void unsupportedEnvelopeAndWrongEntropyLengthAreRejected()throws Exception{
        assertThrows(IllegalArgumentException.class,()->VaultEnvelope.encrypt(new byte[12],newKey,2));
        assertThrows(IllegalStateException.class,()->VaultEnvelope.version("{\"v\":3}".getBytes(StandardCharsets.UTF_8)));
        byte[] updated=VaultEnvelope.encrypt(new byte[16],newKey,2);
        assertThrows(IllegalArgumentException.class,()->VaultUpgrade.migrate(updated,oldKey,newKey,value->fail("must not commit")));
    }
}
