package br.com.otaviomiklos.mottu.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Point {
    
    private float x;
    private float y;
}
