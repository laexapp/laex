package com.laexwallet.testnet;

import org.junit.Test;
import static org.junit.Assert.*;

public class BackupCheckTest {
    @Test public void acceptsCapitalizationAndKeyboardSpacing(){
        assertTrue(BackupCheck.matches("  ABANDON \n","abandon"));
        assertTrue(BackupCheck.matches("\u00a0About\u00a0","about"));
        assertTrue(BackupCheck.matches("\u3000about\u3000","about"));
    }
    @Test public void rejectsMisspellingNumbersAndExtraWords(){
        assertFalse(BackupCheck.matches("abondon","abandon"));
        assertFalse(BackupCheck.matches("1 abandon","abandon"));
        assertFalse(BackupCheck.matches("abandon about","abandon"));
        assertFalse(BackupCheck.matches("","abandon"));
        assertFalse(BackupCheck.matches(null,"abandon"));
    }
    @Test public void reportsExactOneBasedPositions(){
        String phrase="one two three four five six seven eight nine ten eleven twelve";
        assertArrayEquals(new int[0],BackupCheck.incorrect(phrase," One ","SIX","twelve"));
        assertArrayEquals(new int[]{6},BackupCheck.incorrect(phrase,"one","five","twelve"));
        assertArrayEquals(new int[]{1,12},BackupCheck.incorrect(phrase,"two","six","eleven"));
    }
}
