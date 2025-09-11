package br.com.otaviomiklos.mottu.dto.subsidiary;

import java.util.List;

import br.com.otaviomiklos.mottu.dto.yard.YardMongoResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubsidiaryTags {
    
    SubsidiarySummary subsidiary;
    List<YardMongoResponse> yards;
}
