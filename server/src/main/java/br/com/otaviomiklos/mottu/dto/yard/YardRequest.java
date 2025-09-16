package br.com.otaviomiklos.mottu.dto.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.camera.CameraRequest;
import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YardRequest {
    
    @NotBlank(message = "O nome do pátio é obrigatório")
    private String name;

    @Valid
    private List<PointRequest> boundary;

    @Valid
    private List<CameraRequest> cameras;

    @NotNull(message = "O Id da filial é obrigatório")
    private Long subsidiaryId;
}
