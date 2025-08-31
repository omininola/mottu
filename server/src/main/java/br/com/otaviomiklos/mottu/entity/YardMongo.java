package br.com.otaviomiklos.mottu.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "CL_MOTTU_YARD")

@Getter
@Setter
@NoArgsConstructor
public class YardMongo {
    
    @Id
    private String mongoId;
    private Long mysqlId;
    private List<Point> boundary;
    private List<TagPositionRequest> tags;
}
