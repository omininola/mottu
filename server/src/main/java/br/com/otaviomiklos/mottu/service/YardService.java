package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.yard.YardCameraResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardMongoRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardMongoResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.entity.yard.YardMongo;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.YardMapper;
import br.com.otaviomiklos.mottu.mapper.YardMongoMapper;
import br.com.otaviomiklos.mottu.repository.yard.YardMongoRepository;
import br.com.otaviomiklos.mottu.repository.yard.YardRepository;

@Service
public class YardService {
    
    @Autowired
    private YardRepository repository;

    @Autowired
    private YardMongoRepository mongoRepository;
    
    @Autowired
    private YardMapper mapper;

    @Autowired
    private YardMongoMapper mongoMapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

    public YardResponse save(YardRequest request) {
        Yard yard = repository.save(mapper.toEntity(request));
        mongoRepository.save(mapper.toMongoEntity(request, yard.getId()));

        return mapper.toResponse(yard);
    }

    public List<YardResponse> findAll() {
        List<Yard> yards = repository.findAll();
        return mapper.toResponse(yards);
    }

    public YardResponse findById(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(yard.get());
    }

    public YardResponse update(YardRequest request, Long id) {
        Optional<Yard> yard = repository.findById(id);
        Optional<YardMongo> yardMongo = mongoRepository.findByMysqlId(id);
        if (yard.isEmpty() || yardMongo.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Yard newYard = mapper.toEntity(request);
        newYard.setId(id);

        YardMongo newMongoYard = mapper.toMongoEntity(request, id);
        newMongoYard.setMongoId(yardMongo.get().getMongoId());

        Yard savedYard = repository.save(newYard);
        mongoRepository.save(newMongoYard);

        return mapper.toResponse(savedYard);
    }

    public void delete(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    // Mongo Related
    public YardMongoResponse postOrUpdatePositions(YardMongoRequest request, Long mysqlId) {
        Optional<YardMongo> yard = mongoRepository.findByMysqlId(mysqlId);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        YardMongo yardToSave = yard.get();
        yardToSave.setTags(request.getTags());

        mongoRepository.save(yardToSave);

        return mongoMapper.toMongoResponse(yardToSave);
    }

    public YardMongoResponse readAllFromYard(Long mysqlId) {
        Optional<YardMongo> yard = mongoRepository.findByMysqlId(mysqlId);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mongoMapper.toMongoResponse(yard.get());
    }

    // Camera Related
    public YardCameraResponse readCameras(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toCameraResponse(yard.get());
    }
}
