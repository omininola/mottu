package br.com.otaviomiklos.mottu.entity;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.area.Delimiter;
import br.com.otaviomiklos.mottu.dto.tagPosition.Point;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_MOTTU_AREAS")

@Getter
@Setter
@NoArgsConstructor
public class Area {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ds_status", nullable = false)
    private AreaStatus status;

    @Embedded
    @Column(name = "ds_delimiter", nullable = false)
    private Delimiter delimiter;
    
    @OneToMany(mappedBy = "area")
    private List<Bike> bikes;
    
    @ManyToOne
    @JoinColumn(name = "yard_id")
    private Yard yard;

    public boolean checkInside (Point point) {
        float x = point.getX();
        float y = point.getX();

        float upLeftX = delimiter.getUpLeft().getX();
        float upRightX = delimiter.getUpRight().getX();
        float upLeftY = delimiter.getUpLeft().getY();
        float downLeftY = delimiter.getDownLeft().getY();

        if (upLeftX < x || upRightX > x) return false;
        if (upLeftY < y || downLeftY > y) return false;
        return true;
    }
}
