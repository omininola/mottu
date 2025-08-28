package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.area.AreaRequest;
import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.entity.Area;
import br.com.otaviomiklos.mottu.repository.AreaRepository;

@Service
public class AreaService {
    
    @Autowired
    private AreaRepository repository;

    public AreaResponse save(AreaRequest request) {
        Area area = repository.save(toArea(request));
        return toResponse(area);
    }

    public List<AreaResponse> findAll() {
        List<Area> areas = repository.findAll();
        return toResponse(areas);
    }

    public Optional<AreaResponse> findById(Long id) {
        Optional<Area> area = repository.findById(id);
        return Optional.ofNullable(toResponse(area.get()));
    }

    public Optional<AreaResponse> update(AreaRequest request, Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) return null;

        Area newArea = toArea(request);
        newArea.setId(id);

        Area savedArea = repository.save(newArea);
        return Optional.of(toResponse(savedArea));
    }

    public boolean delete(Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) return false;
        
        repository.deleteById(id);
        return true;
    }

    private static AreaResponse toResponse(Area area) {
        AreaResponse response = new AreaResponse();
        return response;
    }

    private static List<AreaResponse> toResponse(List<Area> areas) {
        return areas.stream().map(AreaService::toResponse).collect(Collectors.toList());
    }

    private static Area toArea(AreaRequest request) {
        Area area = new Area();
        return area;
    }
}
