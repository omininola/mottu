package br.com.otaviomiklos.mottu.dto.tagPosition;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagPositionResponse {
    
    private ApriltagResponse tag;
    private BikeResponse bike;
    private Point position;
    private AreaStatus areaStatus;
    private boolean isInRightArea;
}
