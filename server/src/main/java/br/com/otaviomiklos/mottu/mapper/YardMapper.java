package br.com.otaviomiklos.mottu.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.dto.camera.CameraResponse;
import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardCameraResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.entity.yard.YardMongo;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;
import br.com.otaviomiklos.mottu.repository.yard.YardMongoRepository;

@Component
public class YardMapper {

    @Autowired
    private YardMongoRepository mongoRepository;
    
    @Autowired
    private SubsidiaryRepository subsidiaryRepository;
    
    @Autowired
    private AreaMapper areaMapper;

    @Autowired
    private CameraMapper cameraMapper;

    @Autowired
    private PointMapper pointMapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";
    private final String SUBSIDIARY_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";
    
    public YardResponse toResponse(Yard yard) {
        List<AreaResponse> areas = new ArrayList<>();
        if (yard.getAreas() != null) areas = areaMapper.toResponse(yard.getAreas());

        Optional<YardMongo> yardMongo = mongoRepository.findByMysqlId(yard.getId());
        if (yardMongo.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        List<PointResponse> boundary = null;
        if (yardMongo.get().getBoundary() != null) boundary = pointMapper.toResponse(yardMongo.get().getBoundary());

        YardResponse response = new YardResponse();
        response.setId(yard.getId());
        response.setName(yard.getName());
        response.setSubsidiary(yard.getSubsidiary().getName());
        response.setBoundary(boundary);
        response.setAreas(areas);
        return response;
    }

    public List<YardResponse> toResponse(List<Yard> yards) {
        return yards.stream().map(yard -> toResponse(yard)).collect(Collectors.toList());
    }

    public Yard toEntity(YardRequest request) {
        Optional<Subsidiary> subsidiary = subsidiaryRepository.findById(request.getSubsidiaryId());
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(SUBSIDIARY_NOT_FOUND_MESSAGE);

        Yard yard = new Yard();
        yard.setName(request.getName());
        yard.setSubsidiary(subsidiary.get());
        return yard;
    }

    public YardCameraResponse toCameraResponse(Yard yard) {
        List<CameraResponse> cameras = new ArrayList<>();
        if (yard.getCameras() != null) cameras = cameraMapper.toResponse(yard.getCameras());

        Optional<YardMongo> yardMongo = mongoRepository.findByMysqlId(yard.getId());
        if (yardMongo.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        List<PointResponse> boundary = null;
        if (yardMongo.get().getBoundary() != null) boundary = pointMapper.toResponse(yardMongo.get().getBoundary());

        YardCameraResponse response = new YardCameraResponse();
        response.setId(yard.getId());
        response.setCameras(cameras);
        response.setBoundary(boundary);
        return response;
    }

    public YardMongo toMongoEntity(YardRequest request, Long mysqlId) {
        List<Point> boundary = null;
        if (request.getBoundary() != null) {
            List<PointRequest> points = request.getBoundary();

            boundary = points.stream()
            .map(point ->  new Point(point.getX(), point.getY()))
            .collect(Collectors.toList());
        }

        YardMongo yard = new YardMongo();
        yard.setMysqlId(mysqlId);
        yard.setBoundary(boundary);
        yard.setTags(new ArrayList<>());
        return yard;
    }
}
