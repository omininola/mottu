package br.com.otaviomiklos.mottu.dto.point;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointRequest {

    @NotNull(message = "O eixo X é obrigatório")
    private float x;

    @NotNull(message = "O eixo Y é obrigatório")
    private float y;
}
