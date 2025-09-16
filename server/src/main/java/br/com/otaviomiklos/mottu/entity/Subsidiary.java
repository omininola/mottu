package br.com.otaviomiklos.mottu.entity;

import java.util.List;

import br.com.otaviomiklos.mottu.entity.yard.Yard;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_MOTTU_SUBSIDIARIES")

@Getter
@Setter
@NoArgsConstructor
public class Subsidiary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nm_subsidiary", nullable = false)
    private String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
    
    @OneToMany(mappedBy = "subsidiary")
    private List<Yard> yards;

    @OneToMany(mappedBy = "subsidiary")
    private List<Apriltag> apriltags;
}
