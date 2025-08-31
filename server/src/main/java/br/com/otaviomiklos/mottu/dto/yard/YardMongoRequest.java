package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YardMongoRequest {
    
    @Valid
    private List<TagPositionRequest> tags;
}
