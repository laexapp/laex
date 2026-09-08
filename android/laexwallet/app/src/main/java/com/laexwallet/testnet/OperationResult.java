package com.laexwallet.testnet;

/** Captures recoverable runtime incompatibilities without retaining exception messages. */
final class OperationResult<T> {
    interface Work<T> { T run() throws Exception; }
    final T value;
    final Throwable error;
    private OperationResult(T value, Throwable error) { this.value=value;this.error=error; }
    static <T> OperationResult<T> run(Work<T> work) {
        try { return new OperationResult<>(work.run(),null); }
        catch (Exception | LinkageError error) { return new OperationResult<>(null,error); }
    }
    static String diagnostic(Throwable error) {
        StringBuilder result=new StringBuilder("LW-101 / ");
        Throwable current=error;
        for(int depth=0;current!=null&&depth<3;depth++,current=current.getCause()) {
            if(depth>0)result.append(" / ");
            result.append(current.getClass().getSimpleName());
            StackTraceElement[] trace=current.getStackTrace();
            if(trace.length>0)result.append(" @ ").append(trace[0].getClassName())
                .append('.').append(trace[0].getMethodName()).append(':').append(trace[0].getLineNumber());
        }
        return result.toString();
    }
}
