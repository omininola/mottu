package br.com.otaviomiklos.mottu.dto.apriltag;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApriltagResponse {

    private Long id;
    private String code;
    private String subsidiary;
    private String bike;
}