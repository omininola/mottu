package br.com.otaviomiklos.mottu.dto.yard;

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

    @NotNull(message = "O Id da filial é obrigatório")
    private Long subsidiaryId;
}
