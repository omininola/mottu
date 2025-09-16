package br.com.otaviomiklos.mottu.entity.area;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "CL_MOTTU_AREA")

@Getter
@Setter
@NoArgsConstructor
public class AreaMongo {
    
    @Id
    private String mongoId;
    private Long mysqlId;
    private AreaStatus status;
    private List<Point> boundary;

    public boolean checkInside(Point point) {
        int crossings = 0;

        for (int i = 0; i < this.boundary.size(); i++) {
            Point a = this.boundary.get(i);
            Point b = this.boundary.get((i + 1) % this.boundary.size());

            if (((a.getY() > point.getY()) != (b.getY() > point.getY()))) {
                double slope = (b.getX() - a.getX()) / (b.getY() - a.getY());
                double xAtY = a.getX() + slope * (point.getY() - a.getY());
                if (point.getX() < xAtY) {
                    crossings++;
                }
            }
        }
        return (crossings % 2 == 1);
    }
}
