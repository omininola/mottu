package br.com.otaviomiklos.mottu.dto.bike;

import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BikeRequest {
    
    @NotBlank(message = "A placa da moto é obrigatória")
    private String plate;

    @NotBlank(message = "O número do chassi da moto é obrigatório")
    private String chassis;

    @NotBlank(message = "O modelo da moto é obrigatório")
    private BikeModel model;

    @NotBlank(message = "O status da moto é obrigatório")
    private AreaStatus status;
}
