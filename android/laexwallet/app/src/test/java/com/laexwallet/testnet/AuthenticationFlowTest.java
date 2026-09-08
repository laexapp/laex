package com.laexwallet.testnet;

import org.junit.Test;
import static org.junit.Assert.*;

public class AuthenticationFlowTest {
    @Test public void pinResultWaitsForForegroundAndRunsOnce(){
        AuthenticationFlow flow=new AuthenticationFlow();Runnable action=()->{};
        long request=flow.begin(action);flow.accept(request);
        assertNull(flow.consume(false));assertTrue(flow.isPending());
        assertSame(action,flow.consume(true));assertNull(flow.consume(true));
        flow.accept(request);assertNull(flow.consume(true));
    }
    @Test public void oldPromptCannotAuthorizeNewRequest(){
        AuthenticationFlow flow=new AuthenticationFlow();long old=flow.begin(()->{});
        Runnable next=()->{};long current=flow.begin(next);
        flow.accept(old);assertNull(flow.consume(true));assertFalse(flow.cancel(old));
        flow.accept(current);assertSame(next,flow.consume(true));
    }
    @Test public void cancellationAndActivityDestructionDiscardAction(){
        AuthenticationFlow flow=new AuthenticationFlow();long request=flow.begin(()->{});
        flow.accept(request);assertTrue(flow.cancel(request));assertNull(flow.consume(true));
        request=flow.begin(()->{});flow.clear();flow.accept(request);assertNull(flow.consume(true));
    }
    @Test public void foregroundAloneDoesNotGrantAccess(){
        AuthenticationFlow flow=new AuthenticationFlow();flow.begin(()->{});
        assertNull(flow.consume(true));assertTrue(flow.isPending());
    }
}
