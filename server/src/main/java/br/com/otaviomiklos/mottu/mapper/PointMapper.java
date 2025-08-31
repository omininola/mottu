package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.point.PointRequest;
import br.com.otaviomiklos.mottu.dto.point.PointResponse;
import br.com.otaviomiklos.mottu.entity.Point;

@Component
public class PointMapper {
    
    public PointResponse toResponse(Point point) {
        return new PointResponse(point.getX(), point.getY());
    }

    public List<PointResponse> toResponse(List<Point> points) {
        return points.stream().map(point -> toResponse(point)).collect(Collectors.toList());
    }

    public Point toEntity(PointRequest request) {
        return new Point(request.getX(), request.getY());
    }

    public List<Point> toEntity(List<PointRequest> requests) {
        return requests.stream().map(request -> toEntity(request)).collect(Collectors.toList());
    }
}
