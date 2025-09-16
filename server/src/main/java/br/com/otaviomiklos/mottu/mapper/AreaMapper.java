package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.area.AreaRequest;
import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.area.Area;
import br.com.otaviomiklos.mottu.entity.area.AreaMongo;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.area.AreaMongoRepository;
import br.com.otaviomiklos.mottu.repository.yard.YardRepository;

@Component
public class AreaMapper {

    
    @Autowired
    private AreaMongoRepository mongoRepository;
    
    @Autowired
    private YardRepository yardRepository;

    @Autowired
    private PointMapper pointMapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma área com esse ID";
    private final String YARD_NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

    public AreaResponse toResponse(Area area) {
        Optional<AreaMongo> areaMongo = mongoRepository.findByMysqlId(area.getId());
        if (areaMongo.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        List<PointResponse> boundary = null;
        if (areaMongo.get().getBoundary() != null) boundary = pointMapper.toResponse(areaMongo.get().getBoundary());

        AreaResponse response = new AreaResponse();
        response.setId(area.getId());
        response.setStatus(area.getStatus());
        response.setYard(area.getYard().getName());
        response.setBoundary(boundary);
        return response;
    }

    public List<AreaResponse> toResponse(List<Area> areas) {
        return areas.stream().map(area -> toResponse(area)).collect(Collectors.toList());
    }

    public Area toEntity(AreaRequest request) {
        Optional<Yard> yard = yardRepository.findById(request.getYardId());
        if (yard.isEmpty()) throw new ResourceNotFoundException(YARD_NOT_FOUND_MESSAGE);

        Area area = new Area();
        area.setStatus(request.getStatus());
        area.setYard(yard.get());
        return area;
    }

    public AreaMongo toMongoEntity(AreaRequest request, Long mysqlId) {
        List<Point> boundary = null;
        if (request.getBoundary() != null) boundary = pointMapper.toEntity(request.getBoundary());

        AreaMongo area = new AreaMongo();
        area.setMysqlId(mysqlId);
        area.setStatus(request.getStatus());
        area.setBoundary(boundary);
        return area;
    }

}
