package com.laexwallet.testnet;

import org.web3j.crypto.Bip32ECKeyPair;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Keys;
import org.web3j.crypto.MnemonicUtils;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.crypto.Hash;
import org.web3j.utils.Numeric;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Locale;

/** Native testnet signer. No caller can select a production chain. */
public final class WalletCore {
    public static final long CHAIN_ID = 97;
    public static final String RPC = "https://data-seed-prebsc-1-s1.bnbchain.org:8545";
    public static final String EXPLORER = "https://testnet.bscscan.com";
    public static final String FAUCET = "https://www.bnbchain.org/en/testnet-faucet";
    public static final BigInteger GAS_LIMIT = BigInteger.valueOf(21000);
    public static final BigInteger MAX_TEST_VALUE = BigInteger.TEN.pow(18); // 1 tBNB per transfer in this pilot.
    private static final int HARD = Bip32ECKeyPair.HARDENED_BIT;
    private WalletCore() {}
    public static byte[] newEntropy() { byte[] entropy=new byte[16];new SecureRandom().nextBytes(entropy);return entropy; }
    public static String words(byte[] entropy) { return MnemonicUtils.generateMnemonic(entropy); }
    public static byte[] entropy(String input) {
        String phrase=input.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+"," ");
        if (phrase.split(" ").length != 12 || !MnemonicUtils.validateMnemonic(phrase)) throw new IllegalArgumentException("Necesitas las 12 palabras de una wallet de prueba, en el orden correcto.");
        return MnemonicUtils.generateEntropy(phrase);
    }
    private static Credentials credentials(byte[] entropy) {
        byte[] seed=MnemonicUtils.generateSeed(words(entropy),"");
        try { return Credentials.create(Bip32ECKeyPair.deriveKeyPair(Bip32ECKeyPair.generateKeyPair(seed),new int[]{44|HARD,60|HARD,0|HARD,0,0})); }
        finally { Arrays.fill(seed,(byte)0); }
    }
    public static String address(byte[] entropy) { return Keys.toChecksumAddress(credentials(entropy).getAddress()); }
    public static String validAddress(String input) {
        String value=input.trim();
        if (!value.matches("0x[0-9a-fA-F]{40}") || value.matches("0x0{40}")) throw new IllegalArgumentException("Introduce una dirección 0x válida; no uses la dirección cero.");
        String body=value.substring(2);
        if (!body.equals(body.toLowerCase(Locale.ROOT)) && !body.equals(body.toUpperCase(Locale.ROOT)) && !Keys.toChecksumAddress(value).equals(value)) throw new IllegalArgumentException("La dirección tiene una suma de comprobación incorrecta. Vuelve a copiarla.");
        return Keys.toChecksumAddress(value);
    }
    public static BigInteger amount(String input) {
        String value=input.trim().replace(',','.');
        if(!value.matches("\\d+(\\.\\d{1,18})?"))throw new IllegalArgumentException("Usa un importe positivo con hasta 18 decimales.");
        BigInteger wei=new BigDecimal(value).movePointRight(18).toBigIntegerExact();
        if(wei.signum()<=0 || wei.compareTo(MAX_TEST_VALUE)>0)throw new IllegalArgumentException("En esta prueba puedes enviar más de 0 y hasta 1 tBNB por operación.");
        return wei;
    }
    public static String format(BigInteger wei) { return new BigDecimal(wei,18).stripTrailingZeros().toPlainString(); }
    public record Draft(String from,String to,BigInteger value,BigInteger nonce,BigInteger gasPrice,long createdAt) {
        public BigInteger fee(){return gasPrice.multiply(GAS_LIMIT);}
        public BigInteger total(){return value.add(fee());}
    }
    public static String sign(byte[] entropy,Draft draft,long now) {
        if(now-draft.createdAt()<0 || now-draft.createdAt()>120000)throw new IllegalArgumentException("La revisión caducó. Comprueba otra vez el envío.");
        Credentials credentials=credentials(entropy);
        if(!credentials.getAddress().equalsIgnoreCase(draft.from()))throw new IllegalArgumentException("La cuenta cambió. Revisa de nuevo.");
        validAddress(draft.to());
        if(draft.value().signum()<=0||draft.value().compareTo(MAX_TEST_VALUE)>0||draft.nonce().signum()<0||draft.gasPrice().signum()<=0)throw new IllegalArgumentException("Transacción de prueba inválida.");
        RawTransaction raw=RawTransaction.createEtherTransaction(draft.nonce(),draft.gasPrice(),GAS_LIMIT,draft.to(),draft.value());
        return Numeric.toHexString(TransactionEncoder.signMessage(raw,CHAIN_ID,credentials));
    }
    public static String transactionHash(String raw) {return Numeric.toHexString(Hash.sha3(Numeric.hexStringToByteArray(raw)));}
}
