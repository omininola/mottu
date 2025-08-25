package br.com.otaviomiklos.mottu.dto.apriltag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApriltagRequest {
    
    @NotBlank(message = "O código da tag é obrigatório")
    private String code;

    @NotNull(message = "O Id da filial é obrigatório")
    private Long subsidiaryId;
}
