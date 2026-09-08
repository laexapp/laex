package com.laexwallet.testnet;

import org.junit.Test;
import org.web3j.crypto.TransactionDecoder;
import org.web3j.crypto.SignedRawTransaction;
import java.math.BigInteger;
import java.util.Arrays;
import static org.junit.Assert.*;

public class WalletCoreTest {
    // Public BIP39 test vector. Never fund this address on any chain.
    private static final String WORDS="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    private static final String ADDRESS="0x9858EfFD232B4033E47d90003D41EC34EcaEda94";
    private static final String TO="0x1111111111111111111111111111111111111111";
    @Test public void recoveryMatchesPublicBip44Vector(){
        byte[] entropy=WalletCore.entropy(WORDS);assertEquals(16,entropy.length);assertArrayEquals(new byte[16],entropy);
        assertEquals(WORDS,WalletCore.words(entropy));assertEquals(ADDRESS,WalletCore.address(entropy));Arrays.fill(entropy,(byte)0);
    }
    @Test public void generatedWalletRestoresSameAddress(){
        byte[] first=WalletCore.newEntropy(),second=WalletCore.newEntropy();assertFalse(Arrays.equals(first,second));
        byte[] restored=WalletCore.entropy(WalletCore.words(first));assertArrayEquals(first,restored);assertEquals(WalletCore.address(first),WalletCore.address(restored));
    }
    @Test public void rejectsBadRecoveryAndAddresses(){
        assertThrows(IllegalArgumentException.class,()->WalletCore.entropy("abandon ".repeat(12)));
        assertThrows(IllegalArgumentException.class,()->WalletCore.entropy("not a phrase"));
        assertThrows(IllegalArgumentException.class,()->WalletCore.validAddress("0x"+"0".repeat(40)));
        assertThrows(IllegalArgumentException.class,()->WalletCore.validAddress("0x9858EffD232B4033E47d90003D41EC34EcaEda94"));
        assertEquals(ADDRESS,WalletCore.validAddress(ADDRESS.toLowerCase()));
    }
    @Test public void amountsAreExactAndPilotLimitIsEnforced(){
        assertEquals(BigInteger.ONE,WalletCore.amount("0.000000000000000001"));
        assertEquals(new BigInteger("10000000000000000"),WalletCore.amount("0,01"));
        for(String value:new String[]{"0","-1","1.000000000000000001","1e-3","0.0000000000000000001","NaN"})assertThrows(IllegalArgumentException.class,()->WalletCore.amount(value));
    }
    @Test public void signatureRecoversSenderAndBindsOnlyTestnet97()throws Exception{
        long now=1000000;
        WalletCore.Draft draft=new WalletCore.Draft(ADDRESS,TO,WalletCore.amount("0.01"),BigInteger.ZERO,BigInteger.valueOf(3_000_000_000L),now);
        String raw=WalletCore.sign(WalletCore.entropy(WORDS),draft,now);
        SignedRawTransaction decoded=(SignedRawTransaction)TransactionDecoder.decode(raw);
        assertEquals(Long.valueOf(97),decoded.getChainId());assertEquals(ADDRESS.toLowerCase(),decoded.getFrom());assertEquals(TO,decoded.getTo());
        assertEquals(draft.value(),decoded.getValue());assertEquals(draft.total(),draft.value().add(draft.fee()));assertEquals(66,WalletCore.transactionHash(raw).length());
        assertThrows(IllegalArgumentException.class,()->WalletCore.sign(WalletCore.entropy(WORDS),draft,now+120001));
        WalletCore.Draft wrong=new WalletCore.Draft(TO,ADDRESS,draft.value(),draft.nonce(),draft.gasPrice(),now);
        assertThrows(IllegalArgumentException.class,()->WalletCore.sign(WalletCore.entropy(WORDS),wrong,now));
    }
}
