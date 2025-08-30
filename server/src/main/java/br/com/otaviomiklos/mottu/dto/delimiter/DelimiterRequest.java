package br.com.otaviomiklos.mottu.dto.delimiter;

import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DelimiterRequest {
    
    @Valid
    private PointRequest upLeft;
    
    @Valid
    private PointRequest upRight;
    
    @Valid
    private PointRequest downRight;
    
    @Valid
    private PointRequest downLeft;
}
