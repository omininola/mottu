package br.com.otaviomiklos.mottu.dto.area;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AreaResponse {
    
    private Long id;
    private AreaStatus status;
    private String yard;
    private List<PointResponse> boundary;
}
