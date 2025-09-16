package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.bike.BikeRequest;
import br.com.otaviomiklos.mottu.dto.bike.BikeSummaryDTO;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiarySummary;
import br.com.otaviomiklos.mottu.dto.bike.BikeDetailsDTO;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.yard.Yard;

@Component
public class BikeMapper {
    
    @Autowired
    private YardMapper yardMapper;

    public BikeDetailsDTO toResponse(Bike bike) {
        String tagCode = null;
        if (bike.getTag() != null) tagCode = bike.getTag().getCode();

        YardResponse yardResponse = null;
        SubsidiarySummary subsidiaryResponse = null;
        if (bike.getYard() != null) {
            Yard yard = bike.getYard();
            Subsidiary subsidiary = bike.getYard().getSubsidiary();
            
            subsidiaryResponse = new SubsidiarySummary();
            subsidiaryResponse.setId(subsidiary.getId());
            subsidiaryResponse.setName(subsidiary.getName());
            subsidiaryResponse.setAddress(subsidiary.getAddress().toString());

            yardResponse = yardMapper.toResponse(yard);
        }

        BikeDetailsDTO response = new BikeDetailsDTO();
        response.setId(bike.getId());
        response.setPlate(bike.getPlate());
        response.setChassis(bike.getChassis());
        response.setModel(bike.getModel());
        response.setStatus(bike.getStatus());
        response.setTagCode(tagCode);
        response.setYard(yardResponse);
        response.setSubsidiary(subsidiaryResponse);
        return response;
    }

    public List<BikeDetailsDTO> toResponse(List<Bike> bikes) {
        return bikes.stream().map(bike -> toResponse(bike)).collect(Collectors.toList());
    }

    public BikeSummaryDTO toSummary(Bike bike) {
        BikeSummaryDTO response = new BikeSummaryDTO();
        response.setId(bike.getId());
        response.setPlate(bike.getPlate());
        response.setChassis(bike.getChassis());
        response.setModel(bike.getModel());
        response.setStatus(bike.getStatus());
        return response;
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
