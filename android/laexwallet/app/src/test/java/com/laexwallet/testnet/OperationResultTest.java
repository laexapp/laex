package com.laexwallet.testnet;

import org.junit.Test;
import static org.junit.Assert.*;

public class OperationResultTest {
    @Test public void linkageFailureReturnsResultInsteadOfKillingWorker() {
        OperationResult<String> result=OperationResult.run(()->{throw new NoClassDefFoundError("private input");});
        assertNull(result.value);
        assertTrue(result.error instanceof NoClassDefFoundError);
        assertFalse(OperationResult.diagnostic(result.error).contains("private input"));
    }
    @Test public void initializationCauseIsReportedWithoutItsMessage() {
        Throwable error=new ExceptionInInitializerError(new IllegalStateException("secret words"));
        String report=OperationResult.diagnostic(error);
        assertTrue(report.contains("ExceptionInInitializerError"));
        assertTrue(report.contains("IllegalStateException"));
        assertFalse(report.contains("secret words"));
    }
    @Test public void successAndNormalFailureRemainDistinguishable() {
        assertEquals("ready",OperationResult.run(()->"ready").value);
        assertTrue(OperationResult.run(()->{throw new IllegalArgumentException();}).error instanceof IllegalArgumentException);
    }
    @Test public void fatalResourceErrorsAreNotSwallowed() {
        assertThrows(OutOfMemoryError.class,()->OperationResult.run(()->{throw new OutOfMemoryError();}));
    }
}
