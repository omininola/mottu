package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YardTagRequest {
    
    @NotNull(message = "O Id do pátio é obrigatório")
    private Long yardId;
    
    @Valid
    private List<TagPositionRequest> tags;
}
