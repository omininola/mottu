package br.com.otaviomiklos.mottu.dto.subsidiary;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubsidiaryResponse {

    private Long id;
    private String name;
    private String address;
    private List<YardResponse> yards;
    private List<ApriltagResponse> tags;
}