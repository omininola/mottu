package br.com.otaviomiklos.mottu.dto.area;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AreaRequest {
    
    @NotNull(message = "O status da área é obrigatório")
    private AreaStatus status;

    @Valid
    @NotNull(message = "A lista de pontos da limitação de área é obrigatória")
    private List<PointRequest> boundary;

    @NotNull(message = "O Id do pátio é obrigatório")
    private Long yardId;
}
