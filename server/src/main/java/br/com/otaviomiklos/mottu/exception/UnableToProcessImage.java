package br.com.otaviomiklos.mottu.exception;

public class UnableToProcessImage extends RuntimeException {
    public UnableToProcessImage(String message) {
        super(message);
    }
}
