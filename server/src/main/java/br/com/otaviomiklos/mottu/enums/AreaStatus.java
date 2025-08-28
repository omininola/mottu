package br.com.otaviomiklos.mottu.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AreaStatus {
    BROKEN("Broken"),
    READY("Ready");

    private String status;
}
