package br.com.otaviomiklos.mottu.dto.bike;

import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BikeSummaryDTO {
    
    private Long id;
    private String plate;
    private String chassis;
    private BikeModel model;
    private AreaStatus status;
}
