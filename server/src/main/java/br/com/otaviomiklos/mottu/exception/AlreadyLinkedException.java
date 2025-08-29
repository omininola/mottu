package br.com.otaviomiklos.mottu.exception;

public class AlreadyLinkedException extends RuntimeException {
    public AlreadyLinkedException(String message) {
        super(message);
    }
}
