package com.laexwallet.testnet;

/** Main-thread state machine: stale/cancelled callbacks never resume a sensitive action. */
final class AuthenticationFlow {
    private long generation;
    private Runnable pending;
    private boolean accepted;
    long begin(Runnable action){generation++;pending=action;accepted=false;return generation;}
    boolean isCurrent(long request){return generation==request&&pending!=null;}
    boolean isPending(){return pending!=null;}
    void accept(long request){if(isCurrent(request))accepted=true;}
    boolean cancel(long request){if(!isCurrent(request))return false;clear();return true;}
    void clear(){generation++;pending=null;accepted=false;}
    Runnable consume(boolean resumed){if(!resumed||!accepted)return null;Runnable action=pending;clear();return action;}
}
