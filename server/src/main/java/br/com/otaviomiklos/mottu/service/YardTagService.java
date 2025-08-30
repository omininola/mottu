package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardTagRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardTagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Area;
import br.com.otaviomiklos.mottu.entity.Point;
import br.com.otaviomiklos.mottu.entity.Yard;
import br.com.otaviomiklos.mottu.entity.YardTag;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.YardRepository;
import br.com.otaviomiklos.mottu.repository.YardTagRepository;

@Service
public class YardTagService {
    
    @Autowired
    private YardTagRepository mongoRepository;

    @Autowired
    private YardRepository repository;

    @Autowired
    private ApriltagRepository apriltagRepository;
    
    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";
    private static final String APRILTAG_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma apriltag com esse código dentro desse pátio";

    public YardTagResponse postOrUpdatePositions(YardTagRequest request, Long yardId) {
        Optional<YardTag> yard = mongoRepository.findByMysqlYardId(yardId);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        YardTag yardTag = toYardTag(request);  
        yardTag.setMysqlYardId(yardId);
        yardTag.setYardId(yard.get().getYardId());

        mongoRepository.save(yardTag);

        return toResponse(yardTag);
    }

    public YardTagResponse readAllFromYard(Long yardId) {
        Optional<YardTag> yardTag = mongoRepository.findByMysqlYardId(yardId);
        if (yardTag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(yardTag.get());
    }

    public YardTagResponse toResponse(YardTag yardTag) {
        Optional<Yard> yard = repository.findById(yardTag.getMysqlYardId());
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        YardTagResponse response = new YardTagResponse();
        response.setYard(YardService.toResponse(yard.get()));
        response.setTags(toResponse(yardTag.getTags(), yard.get()));
        return response;
    }

    private TagPositionResponse toResponse(TagPositionRequest request, Yard yard) {
        Optional<Apriltag> apriltagOptional = apriltagRepository.findByCodeAndSubsidiaryId(request.getTagCode(), yard.getSubsidiary().getId());
        if (apriltagOptional.isEmpty()) throw new ResourceNotFoundException(APRILTAG_NOT_FOUND_MESSAGE);
        
        Apriltag apriltag = apriltagOptional.get();
        
        BikeResponse bike = null; 
        if (apriltag.getBike() != null) bike = BikeService.toResponse(apriltag.getBike());

        Point position = new Point(request.getPosition().getX(), request.getPosition().getY());
        List<Area> areas = yard.getAreas();

        Optional<Area> area = areas.stream().filter(areaToFilter -> areaToFilter.checkInside(position)).findFirst();
        
        AreaStatus areaStatus;
        if (area.isEmpty()) areaStatus = null;
        else areaStatus = area.get().getStatus();
        
        boolean isInRightArea = false;
        if (areaStatus == null) isInRightArea = true;
        else if (bike != null && areaStatus == bike.getStatus()) isInRightArea = true;
        
        TagPositionResponse response =  new TagPositionResponse();
        response.setTag(ApriltagService.toResponse(apriltag));
        response.setBike(bike);
        response.setPosition(position);
        response.setAreaStatus(areaStatus);
        response.setInRightArea(isInRightArea);
        return response;
    }

    private List<TagPositionResponse> toResponse(List<TagPositionRequest> requests, Yard yard) {
        return requests.stream().map(request -> toResponse(request, yard)).collect(Collectors.toList());
    }

    public YardTag toYardTag(YardTagRequest request) {
        YardTag yardTag = new YardTag();
        yardTag.setTags(request.getTags());
        return yardTag;
    }

}
