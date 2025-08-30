package br.com.otaviomiklos.mottu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Delimiter {
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "up_left_x")),
        @AttributeOverride(name = "y", column = @Column(name = "up_left_y"))
    })
    private Point upLeft;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "up_right_x")),
        @AttributeOverride(name = "y", column = @Column(name = "up_right_y"))
    })
    private Point upRight;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "down_right_x")),
        @AttributeOverride(name = "y", column = @Column(name = "down_right_y"))
    })
    private Point downRight;
    
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "x", column = @Column(name = "down_left_x")),
        @AttributeOverride(name = "y", column = @Column(name = "down_left_y"))
    })
    private Point downLeft;

}
