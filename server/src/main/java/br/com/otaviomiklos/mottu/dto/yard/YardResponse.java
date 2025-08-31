package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YardResponse {
    
    private Long id;
    private String name;
    private String subsidiary;
    private List<AreaResponse> areas;
    private List<PointResponse> boundary;
}
