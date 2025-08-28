package br.com.otaviomiklos.mottu.dto.tagPosition;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagPositionRequest {
    
    @NotBlank(message = "O código da tag é obrigatório")
    private String tagCode;

    @Valid
    private Position position;
}
