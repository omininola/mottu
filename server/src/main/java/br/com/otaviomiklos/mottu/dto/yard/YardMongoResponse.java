package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YardMongoResponse {
    
    private YardResponse yard;
    private List<TagPositionResponse> tags;
}
