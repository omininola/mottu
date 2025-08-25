package br.com.otaviomiklos.mottu.entity;

import java.util.List;

import br.com.otaviomiklos.mottu.enums.AreaStatus;
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

    @Column(name = "ds_delimiter", nullable = false)
    private String delimiter;
    
    @OneToMany(mappedBy = "area")
    private List<Bike> bikes;
    
    @ManyToOne
    @JoinColumn(name = "yard_id")
    private Yard yard;
}
