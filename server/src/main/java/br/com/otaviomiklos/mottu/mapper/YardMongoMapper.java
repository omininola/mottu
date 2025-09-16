package br.com.otaviomiklos.mottu.mapper;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.yard.YardMongoResponse;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.entity.yard.YardMongo;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;
import br.com.otaviomiklos.mottu.repository.yard.YardRepository;

@Component
public class YardMongoMapper {

    @Autowired
    private YardRepository repository;

    @Autowired
    private SubsidiaryRepository subsidiaryRepository;

    @Autowired
    private YardMapper yardMapper;

    @Autowired
    private TagPositionMapper tagPositionMapper;
    
    private final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

    public YardMongoResponse toMongoResponse(YardMongo yardMongo) {
        Optional<Yard> yard = repository.findById(yardMongo.getMysqlId());
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        YardMongoResponse response = new YardMongoResponse();
        response.setYard(yardMapper.toResponse(yard.get()));
        response.setTags(tagPositionMapper.toResponse(yardMongo.getTags(), yard.get()));
        return response;
    }

}
