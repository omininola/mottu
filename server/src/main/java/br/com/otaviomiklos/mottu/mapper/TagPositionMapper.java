package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.bike.BikeSummaryDTO;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.area.Area;
import br.com.otaviomiklos.mottu.entity.area.AreaMongo;
import br.com.otaviomiklos.mottu.entity.yard.Yard;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.BikeRepository;
import br.com.otaviomiklos.mottu.repository.area.AreaMongoRepository;

@Component
public class TagPositionMapper {
    
    @Autowired
    private ApriltagRepository apriltagRepository;

    @Autowired
    private AreaMongoRepository areaMongoRepository;

    @Autowired
    private BikeRepository bikeRepository;

    @Autowired
    private ApriltagMapper apriltagMapper;

    @Autowired
    private BikeMapper bikeMapper;

    public TagPositionResponse toResponse(TagPositionRequest request, Yard yard) {
        Optional<Apriltag> apriltagOptional = apriltagRepository.findByCodeAndSubsidiaryId(request.getTagCode(), yard.getSubsidiary().getId());
        if (apriltagOptional.isEmpty()) return null;
        
        Apriltag apriltag = apriltagOptional.get();
        
        BikeSummaryDTO bike = null; 
        if (apriltag.getBike() != null) {
            
            Bike bikeToSave = apriltag.getBike();
            bikeToSave.setYard(yard);

            bikeRepository.save(bikeToSave);

            bike = bikeMapper.toSummary(apriltag.getBike());
        }

        Point position = new Point(request.getPosition().getX(), request.getPosition().getY());        
        List<Area> areasMysql = yard.getAreas();
        List<AreaMongo> areas = areasMysql.stream()
            .map(area ->{
                Optional<AreaMongo> areaMongo = areaMongoRepository.findByMysqlId(area.getId());
                if (areaMongo.isEmpty()) return null;
                return areaMongo.get();
            })
            .collect(Collectors.toList());

        Optional<AreaMongo> area = areas.stream().filter(areaToFilter -> areaToFilter.checkInside(position)).findFirst();
        
        AreaStatus areaStatus = null;
        if (area.isEmpty()) areaStatus = null;
        else areaStatus = area.get().getStatus();

        boolean isInRightArea = false;
        if (areaStatus == null) isInRightArea = true;
        else if (bike != null && areaStatus == bike.getStatus()) isInRightArea = true;

        TagPositionResponse response =  new TagPositionResponse();
        response.setTag(apriltagMapper.toResponse(apriltag));
        response.setBike(bike);
        response.setPosition(position);
        response.setAreaStatus(areaStatus);
        response.setInRightArea(isInRightArea);
        return response;
    }

    public List<TagPositionResponse> toResponse(List<TagPositionRequest> requests, Yard yard) {
        return requests.stream()
            .map(request -> toResponse(request, yard))
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

}
