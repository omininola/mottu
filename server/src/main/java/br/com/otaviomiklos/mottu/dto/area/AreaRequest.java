package br.com.otaviomiklos.mottu.dto.area;

import br.com.otaviomiklos.mottu.dto.delimiter.DelimiterRequest;
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
    private DelimiterRequest delimiter;

    @NotNull(message = "O Id do pátio é obrigatório")
    private Long yardId;
}
