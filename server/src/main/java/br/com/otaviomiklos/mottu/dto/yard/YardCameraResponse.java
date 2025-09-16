package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.camera.CameraResponse;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YardCameraResponse {
    
    private Long id;
    private List<CameraResponse> cameras;
    private List<PointResponse> boundary;
}
