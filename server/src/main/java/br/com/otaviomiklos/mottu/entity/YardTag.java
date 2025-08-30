package br.com.otaviomiklos.mottu.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "CL_MOTTU_YARD_TAGS")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class YardTag {
    
    @Id
    private String yardId;
    private Long mysqlYardId;
    private List<TagPositionRequest> tags;
}
