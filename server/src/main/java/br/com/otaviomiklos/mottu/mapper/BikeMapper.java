package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.bike.BikeRequest;
import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Bike;

@Component
public class BikeMapper {
    
    @Autowired
    private YardMapper yardMapper;

    public BikeResponse toResponse(Bike bike) {
        String tagCode = null;
        if (bike.getTag() != null) tagCode = bike.getTag().getCode();

        YardResponse yard = null;
        String subsidiary = null;
        if (bike.getYard() != null) {
            yard = yardMapper.toResponse(bike.getYard());
            subsidiary = yard.getSubsidiary();
        }

        BikeResponse response = new BikeResponse();
        response.setId(bike.getId());
        response.setPlate(bike.getPlate());
        response.setChassis(bike.getChassis());
        response.setModel(bike.getModel());
        response.setStatus(bike.getStatus());
        response.setTagCode(tagCode);
        response.setYard(yard);
        response.setSubsidiary(subsidiary);
        return response;
    }

    public List<BikeResponse> toResponse(List<Bike> bikes) {
        return bikes.stream().map(bike -> toResponse(bike)).collect(Collectors.toList());
    }

    public Bike toEntity(BikeRequest request) {
        Bike bike = new Bike();
        bike.setPlate(request.getPlate());
        bike.setChassis(request.getChassis());
        bike.setModel(request.getModel());
        bike.setStatus(request.getStatus());
        return bike;
    }

}
