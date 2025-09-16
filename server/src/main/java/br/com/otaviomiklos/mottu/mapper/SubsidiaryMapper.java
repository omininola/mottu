package br.com.otaviomiklos.mottu.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.address.AddressRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiarySummary;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryTags;
import br.com.otaviomiklos.mottu.dto.yard.YardMongoResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Address;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.entity.yard.YardMongo;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.yard.YardMongoRepository;

@Component
public class SubsidiaryMapper {
    
    @Autowired
    private YardMongoRepository yardMongoRepository;

    @Autowired
    private ApriltagMapper apriltagMapper;

    @Autowired
    private YardMapper yardMapper;

    @Autowired
    private YardMongoMapper yardMongoMapper;

    private final String YARD_NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

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

    public SubsidiarySummary toSummary(Subsidiary subsidiary) {
        SubsidiarySummary summary = new SubsidiarySummary();
        summary.setId(subsidiary.getId());
        summary.setName(subsidiary.getName());
        summary.setAddress(subsidiary.getAddress().toString());
        return summary;
    }

    public SubsidiaryTags toTagResponse(Subsidiary subsidiary) {
        List<YardMongoResponse> yardsResponse = null;
        List<Yard> yards = subsidiary.getYards();
        if (yards.size() != 0) {
            List<YardMongo> yardsMongo = yards.stream()
                .map(yard -> {
                    Optional<YardMongo> yardMongo = yardMongoRepository.findByMysqlId(yard.getId());
                    if (yardMongo.isEmpty()) throw new ResourceNotFoundException(YARD_NOT_FOUND_MESSAGE);
                    return yardMongo.get();
                })
                .collect(Collectors.toList());


            yardsResponse = yardsMongo.stream().map(yardMongo -> yardMongoMapper.toMongoResponse(yardMongo)).collect(Collectors.toList());
        } 

        SubsidiaryTags response = new SubsidiaryTags();
        response.setSubsidiary(toSummary(subsidiary));
        response.setYards(yardsResponse);
        return response;
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
