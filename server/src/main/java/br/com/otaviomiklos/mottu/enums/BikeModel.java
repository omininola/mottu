package br.com.otaviomiklos.mottu.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BikeModel {
    SPORT("Mottu Sport"),
    MOTTUE("Mottu E"),
    POP("Mottu Pop");

    private String model;
}
