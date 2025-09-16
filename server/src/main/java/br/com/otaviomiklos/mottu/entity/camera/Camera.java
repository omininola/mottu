package br.com.otaviomiklos.mottu.entity.camera;

import br.com.otaviomiklos.mottu.entity.yard.Yard;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_MOTTU_CAMERA")

@Getter
@Setter
@NoArgsConstructor
public class Camera {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uri_access", nullable = false)
    private String uriAccess;

    @ManyToOne
    @JoinColumn(name = "yard_id")
    private Yard yard; 
}
