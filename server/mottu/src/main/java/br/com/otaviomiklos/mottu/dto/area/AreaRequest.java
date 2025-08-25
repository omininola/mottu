package br.com.otaviomiklos.mottu.dto.area;

import br.com.otaviomiklos.mottu.enums.AreaStatus;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AreaRequest {
    
    @Enumerated
    @NotBlank(message = "O status da área é obrigatório")
    private AreaStatus status;

    @NotBlank(message = "O delimitador da área é obrigatório")
    private String delimiter;

    @NotNull(message = "O Id do pátio é obrigatório")
    private Long yardId;
}
