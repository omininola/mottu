package br.com.otaviomiklos.mottu.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "TB_MOTTU_APRILTAGS")

@Getter
@Setter
@NoArgsConstructor
public class Apriltag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ds_code", nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "subsidiary_id")
    private Subsidiary subsidiary;

    @OneToOne(mappedBy = "tag", cascade = CascadeType.ALL)
    private Bike bike;
}
