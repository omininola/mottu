package br.com.otaviomiklos.mottu.entity;

import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_MOTTU_BIKES")

@Getter
@Setter
@NoArgsConstructor
public class Bike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ds_plate", nullable = false, unique = true)
    private String plate;

    @Column(name = "ds_chassis", nullable = false, unique = true)
    private String chassis;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_model", nullable = false)
    private BikeModel model;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_status", nullable = false)
    private AreaStatus status;

    @ManyToOne
    @JoinColumn(name = "area_id")
    private Area area;
    
    @OneToOne
    @JoinColumn(name = "tag_id", nullable = true)
    private Apriltag tag;
}
