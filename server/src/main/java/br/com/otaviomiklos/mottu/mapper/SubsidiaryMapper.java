package br.com.otaviomiklos.mottu.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.address.AddressRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Address;
import br.com.otaviomiklos.mottu.entity.Subsidiary;

@Component
public class SubsidiaryMapper {
    
    @Autowired
    private ApriltagMapper apriltagMapper;

    @Autowired
    private YardMapper yardMapper;

    public SubsidiaryResponse toResponse(Subsidiary subsidiary) {
        List<ApriltagResponse> tags = new ArrayList<>();
        if (subsidiary.getApriltags() != null) tags = apriltagMapper.toResponse(subsidiary.getApriltags());

        List<YardResponse> yards = new ArrayList<>();
        if (subsidiary.getYards() != null) yards = yardMapper.toResponse(subsidiary.getYards());

        SubsidiaryResponse response = new SubsidiaryResponse();
        response.setId(subsidiary.getId());
        response.setName(subsidiary.getName());
        response.setAddress(subsidiary.getAddress().toString());
        response.setTags(tags);
        response.setYards(yards);
        return response;
    }

    public List<SubsidiaryResponse> toResponse(List<Subsidiary> subsidiaries) {
        return subsidiaries.stream().map(subsidiary -> toResponse(subsidiary)).collect(Collectors.toList());
    }

    public Subsidiary toEntity(SubsidiaryRequest request) {
        Address address = new Address();
        AddressRequest addressRequest = request.getAddress();
        address.setStreet(addressRequest.getStreet());
        address.setZipCode(addressRequest.getZipCode());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setCountry(addressRequest.getCountry());
        
        Subsidiary subsidiary = new Subsidiary();
        subsidiary.setName(request.getName());
        subsidiary.setAddress(address);
        return subsidiary;
    }

}
