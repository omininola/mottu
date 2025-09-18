package br.com.otaviomiklos.mottu.entity.camera;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import br.com.otaviomiklos.mottu.entity.Point;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "CL_MOTTU_CAMERA")

@Getter
@Setter
@NoArgsConstructor
public class CameraMongo {

    @Id
    private String mongoId;
    private Long mysqlId; 
    private List<Point> transformPoints;
    private List<Point> yardPoints;
}
