package br.com.otaviomiklos.mottu.dto.area;

import br.com.otaviomiklos.mottu.dto.tagPosition.Point;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Embeddable
public class Delimiter {
    
    @Valid
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "up_left_x")),
        @AttributeOverride(name = "y", column = @Column(name = "up_left_y"))
    })
    private Point upLeft;
    
    @Valid
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "up_right_x")),
        @AttributeOverride(name = "y", column = @Column(name = "up_right_y"))
    })
    private Point upRight;
    
    @Valid
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "down_right_x")),
        @AttributeOverride(name = "y", column = @Column(name = "down_right_y"))
    })
    private Point downRight;
    
    @Valid
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "down_left_x")),
        @AttributeOverride(name = "y", column = @Column(name = "down_left_y"))
    })
    private Point downLeft;
}
