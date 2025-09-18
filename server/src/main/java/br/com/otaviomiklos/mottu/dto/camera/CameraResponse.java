package br.com.otaviomiklos.mottu.dto.camera;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CameraResponse {
    
    private Long id;
    private String urlAccess;
    private List<PointResponse> transformPoints;
    private List<PointResponse> yardPoints;
}
