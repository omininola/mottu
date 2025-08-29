package br.com.otaviomiklos.mottu.dto.subsidiary;

import java.util.List;

import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Yard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubsidiaryResponse {

    private Long id;
    private String name;
    private String address;
    private List<Yard> yards;
    private List<Apriltag> tags;
}