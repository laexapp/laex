package com.laexwallet.testnet;

import java.text.Normalizer;
import java.util.Locale;

/** Ignore input casing and surrounding spacing, never spelling or word position. */
final class BackupCheck {
    static String normalize(String input){
        if(input==null)return "";
        return Normalizer.normalize(input,Normalizer.Form.NFKC).strip().toLowerCase(Locale.ROOT);
    }
    static boolean matches(String input,String expected){
        return expected!=null&&!expected.isEmpty()&&normalize(input).equals(expected);
    }
    static int[] incorrect(String phrase,String... answers){
        String[] words=phrase.split(" ");
        if(words.length!=12||answers.length!=3)throw new IllegalArgumentException("Respaldo incompleto.");
        int[] positions={1,6,12};
        return java.util.stream.IntStream.range(0,3)
            .filter(i->!matches(answers[i],words[positions[i]-1])).map(i->positions[i]).toArray();
    }
}
