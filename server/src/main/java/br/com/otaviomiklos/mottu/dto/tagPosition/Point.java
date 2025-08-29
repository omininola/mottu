package br.com.otaviomiklos.mottu.dto.tagPosition;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Embeddable
public class Point {
    
    @NotNull(message = "O eixo x é obrigatório")
    private float x;
    
    @NotNull(message = "O eixo y é obrigatório")
    private float y;
}
