package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YardRequest {
    
    @NotBlank(message = "O nome do pátio é obrigatório")
    private String name;

    @Valid
    @NotNull(message = "A lista de pontos da limitação do pátio é obrigatória")
    private List<PointRequest> boundary;

    @NotNull(message = "O Id da filial é obrigatório")
    private Long subsidiaryId;
}
