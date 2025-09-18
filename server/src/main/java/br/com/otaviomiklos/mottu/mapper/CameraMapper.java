package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.camera.CameraRequest;
import br.com.otaviomiklos.mottu.dto.camera.CameraResponse;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.camera.Camera;
import br.com.otaviomiklos.mottu.entity.camera.CameraMongo;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.camera.CameraMongoRepository;
import br.com.otaviomiklos.mottu.repository.yard.YardRepository;

@Component
public class CameraMapper {

    @Autowired
    private CameraMongoRepository mongoRepository;

    @Autowired
    private YardRepository yardRepository;

    @Autowired
    private PointMapper pointMapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma área com esse ID";
    private final String YARD_NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";

    public CameraResponse toResponse(Camera camera) {
        Optional<CameraMongo> cameraMongo = mongoRepository.findByMysqlId(camera.getId());
        if (cameraMongo.isEmpty())
            throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        List<PointResponse> transformPoints = null;
        if (cameraMongo.get().getTransformPoints() != null)
            transformPoints = pointMapper.toResponse(cameraMongo.get().getTransformPoints());

        List<PointResponse> yardPoints = null;
        if (cameraMongo.get().getYardPoints() != null)
            yardPoints = pointMapper.toResponse(cameraMongo.get().getYardPoints());

        CameraResponse response = new CameraResponse();
        response.setId(camera.getId());
        response.setUrlAccess(camera.getUriAccess());
        response.setTransformPoints(transformPoints);
        response.setYardPoints(yardPoints);
        return response;
    }

    public List<CameraResponse> toResponse(List<Camera> cameras) {
        return cameras.stream().map(camera -> toResponse(camera)).collect(Collectors.toList());
    }

    public Camera toEntity(CameraRequest request) {
        Optional<Yard> yard = yardRepository.findById(request.getYardId());
        if (yard.isEmpty())
            throw new ResourceNotFoundException(YARD_NOT_FOUND_MESSAGE);

        Camera camera = new Camera();
        camera.setUriAccess(request.uriAccess);
        camera.setYard(yard.get());
        return camera;
    }

    public CameraMongo toMongoEntity(CameraRequest request, Long mysqlId) {
        List<Point> transformPoints = null;
        if (request.getTransformPoints() != null)
            transformPoints = pointMapper.toEntity(request.getTransformPoints());

        List<Point> yardPoints = null;
        if (request.getYardPoints() != null)
            yardPoints = pointMapper.toEntity(request.getYardPoints());

        CameraMongo camera = new CameraMongo();
        camera.setMysqlId(mysqlId);
        camera.setTransformPoints(transformPoints);
        camera.setYardPoints(yardPoints);
        return camera;
    }

}
