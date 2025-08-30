package br.com.otaviomiklos.mottu.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.area.AreaRequest;
import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
import br.com.otaviomiklos.mottu.dto.delimiter.DelimiterRequest;
import br.com.otaviomiklos.mottu.dto.delimiter.DelimiterResponse;
import br.com.otaviomiklos.mottu.entity.Area;
import br.com.otaviomiklos.mottu.entity.Delimiter;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.Yard;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.AreaRepository;
import br.com.otaviomiklos.mottu.repository.YardRepository;

@Service
public class AreaService {
    
    @Autowired
    private AreaRepository repository;

    @Autowired
    private YardRepository yardRepository;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma área com esse ID";
    private static final String YARD_NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

    public AreaResponse save(AreaRequest request) {
        Area area = repository.save(toArea(request));
        return toResponse(area);
    }

    public List<AreaResponse> findAll() {
        List<Area> areas = repository.findAll();
        return toResponse(areas);
    }

    public AreaResponse findById(Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(area.get());
    }

    public AreaResponse update(AreaRequest request, Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Area newArea = toArea(request);
        newArea.setId(id);

        Area savedArea = repository.save(newArea);
        return toResponse(savedArea);
    }

    public void delete(Long id) {
        Optional<Area> area = repository.findById(id);
        if (area.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public static AreaResponse toResponse(Area area) {
        List<BikeResponse> bikes = new ArrayList<>();
        if (area.getBikes() != null) bikes = BikeService.toResponse(area.getBikes()); 

        Delimiter areaDelimiter = area.getDelimiter();
        DelimiterResponse delimiter = new DelimiterResponse();
        delimiter.setUpLeft(areaDelimiter.getUpLeft());
        delimiter.setUpRight(areaDelimiter.getUpRight());
        delimiter.setDownRight(areaDelimiter.getDownRight());
        delimiter.setDownLeft(areaDelimiter.getDownLeft());

        AreaResponse response = new AreaResponse();
        response.setId(area.getId());
        response.setDelimiter(delimiter);
        response.setStatus(area.getStatus());
        response.setYard(area.getYard().getName());
        response.setBikes(bikes);
        return response;
    }

    public static List<AreaResponse> toResponse(List<Area> areas) {
        return areas.stream().map(AreaService::toResponse).collect(Collectors.toList());
    }

    public Area toArea(AreaRequest request) {
        Optional<Yard> yard = yardRepository.findById(request.getYardId());
        if (yard.isEmpty()) throw new ResourceNotFoundException(YARD_NOT_FOUND_MESSAGE);

        DelimiterRequest delimiterRequest = request.getDelimiter();
        Delimiter delimiter = new Delimiter();
        delimiter.setUpLeft(new Point(delimiterRequest.getUpLeft().getX(), delimiterRequest.getUpLeft().getY()));
        delimiter.setUpRight(new Point(delimiterRequest.getUpRight().getX(), delimiterRequest.getUpRight().getY()));
        delimiter.setDownRight(new Point(delimiterRequest.getDownRight().getX(), delimiterRequest.getDownRight().getY()));
        delimiter.setDownLeft(new Point(delimiterRequest.getDownLeft().getX(), delimiterRequest.getDownLeft().getY()));

        Area area = new Area();
        area.setStatus(request.getStatus());
        area.setYard(yard.get());
        area.setDelimiter(delimiter);
        return area;
    }
}
