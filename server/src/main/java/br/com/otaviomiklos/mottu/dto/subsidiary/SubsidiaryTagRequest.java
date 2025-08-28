package br.com.otaviomiklos.mottu.dto.subsidiary;

import java.util.List;

import br.com.otaviomiklos.mottu.entity.SubsidiaryTag;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubsidiaryTagRequest {
    
    @NotNull(message = "O Id da filial é obrigatório")
    private Long subsidiaryId;
    
    private List<SubsidiaryTag> tags;
}
