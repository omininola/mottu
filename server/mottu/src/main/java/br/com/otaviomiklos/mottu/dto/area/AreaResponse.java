package br.com.otaviomiklos.mottu.dto.area;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
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
    private List<BikeResponse> bikes;
    private String yard;
}
