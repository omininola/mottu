package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.area.AreaRequest;
import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.entity.area.Area;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.AreaMapper;
import br.com.otaviomiklos.mottu.repository.area.AreaMongoRepository;
import br.com.otaviomiklos.mottu.repository.area.AreaRepository;

@Service
public class AreaService {
    
    @Autowired
    private AreaRepository repository;

    @Autowired
    private AreaMongoRepository mongoRepository;

    @Autowired
    private AreaMapper mapper;

    private final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma área com esse ID";

    public AreaResponse save(AreaRequest request) {
        Area area = repository.save(mapper.toEntity(request));
        mongoRepository.save(mapper.toMongoEntity(request, area.getId())); 
        return mapper.toResponse(area);
    }

    public List<AreaResponse> findAll() {
        List<Area> areas = repository.findAll();
        return mapper.toResponse(areas);
    }

    public AreaResponse findById(Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(area.get());
    }

    public AreaResponse update(AreaRequest request, Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Area newArea = mapper.toEntity(request);
        newArea.setId(id);

        Area savedArea = repository.save(newArea);
        return mapper.toResponse(savedArea);
    }

    public void delete(Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }
}
