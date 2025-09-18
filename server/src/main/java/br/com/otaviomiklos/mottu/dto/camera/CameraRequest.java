package br.com.otaviomiklos.mottu.dto.camera;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CameraRequest {
    
    @NotBlank(message = "A uri de acesso à câmera é obrigatória")
    public String uriAccess;

    @Valid
    @NotNull(message = "A lista de pontos de transformação é obrigatória")
    public List<PointRequest> transformPoints;

    @Valid
    @NotNull(message = "A lista de pontos do pátio é obrigatória")
    public List<PointRequest> yardPoints;

    @NotNull(message = "O Id do pátio é obrigatório")
    private Long yardId;
}
