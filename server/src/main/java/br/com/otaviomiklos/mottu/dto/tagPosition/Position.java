package br.com.otaviomiklos.mottu.dto.tagPosition;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Position {
    
    @NotNull(message = "O eixo x é obrigatório")
    private float x;
    
    @NotNull(message = "O eixo y é obrigatório")
    private float y;
    
    @NotNull(message = "O eixo z é obrigatório")
    private float z;
}
