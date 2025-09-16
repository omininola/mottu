package br.com.otaviomiklos.mottu.entity.yard;

import java.util.List;

import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.area.Area;
import br.com.otaviomiklos.mottu.entity.camera.Camera;
import jakarta.persistence.Column;
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
@Table(name = "TB_MOTTU_YARDS")

@Getter
@Setter
@NoArgsConstructor
public class Yard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nm_yard", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "subsidiary_id")
    private Subsidiary subsidiary;

    @OneToMany(mappedBy = "yard")
    private List<Area> areas;

    @OneToMany(mappedBy = "yard")
    private List<Camera> cameras;

    @OneToMany(mappedBy = "yard")
    private List<Bike> bikes;
}
