package br.com.otaviomiklos.mottu.dto.delimiter;

import br.com.otaviomiklos.mottu.entity.Point;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DelimiterResponse {
    
    private Point upLeft;
    private Point upRight;
    private Point downRight;
    private Point downLeft;
}
