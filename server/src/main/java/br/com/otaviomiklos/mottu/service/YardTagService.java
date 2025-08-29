package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import br.com.otaviomiklos.mottu.dto.tagPosition.Point;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionRequest;
import br.com.otaviomiklos.mottu.dto.tagPosition.TagPositionResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardTagRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardTagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Area;
import br.com.otaviomiklos.mottu.entity.Bike;
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
    private static YardRepository repository;

    @Autowired
    private static ApriltagRepository apriltagRepository;
    
    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";
    private static final String APRILTAG_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma apriltag com esse código dentro desse pátio";

    public YardTagResponse postOrUpdatePositions(YardTagRequest request) {
        YardTag yardTag = mongoRepository.save(toYardTag(request));
        return toResponse(yardTag);
    }

    public YardTagResponse readAllFromYard(Long yardId) {
        Optional<YardTag> yardTag = mongoRepository.findById(yardId);
        if (yardTag.isEmpty()) throw new ResourceAccessException(NOT_FOUND_MESSAGE);
        return toResponse(yardTag.get());
    }

    public static YardTag toYardTag(YardTagRequest request) {
        YardTag yardTag = new YardTag();
        yardTag.setYardId(request.getYardId());
        yardTag.setTags(request.getTags());
        return yardTag;
    }

    public static YardTagResponse toResponse(YardTag yardTag) {
        Optional<Yard> yard = repository.findById(yardTag.getYardId());
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        YardTagResponse response = new YardTagResponse();
        response.setYard(YardService.toResponse(yard.get()));
        response.setTags(toResponse(yardTag.getTags(), yard.get()));
        return response;
    }

    private static TagPositionResponse toResponse(TagPositionRequest request, Yard yard) {
        Optional<Apriltag> apriltagOptional = apriltagRepository.findByCodeAndSubsidiaryId(request.getTagCode(), yard.getSubsidiary().getId());
        if (apriltagOptional.isEmpty()) throw new ResourceNotFoundException(APRILTAG_NOT_FOUND_MESSAGE);
        
        Apriltag apriltag = apriltagOptional.get();
        Bike bike = apriltag.getBike();
        Point position = request.getPosition();
        List<Area> areas = yard.getAreas();

        Optional<Area> area = areas.stream().filter(areaToFilter -> areaToFilter.checkInside(position)).findFirst();
        
        AreaStatus areaStatus;
        if (area.isEmpty()) areaStatus = null;
        else areaStatus = area.get().getStatus();
        
        boolean isInRightArea = false;
        if (areaStatus == null) isInRightArea = true;
        else if (areaStatus == bike.getStatus()) isInRightArea = true;
        
        TagPositionResponse response =  new TagPositionResponse();
        response.setTag(ApriltagService.toResponse(apriltag));
        response.setBike(BikeService.toResponse(bike));
        response.setPosition(position);
        response.setAreaStatus(areaStatus);
        response.setInRightArea(isInRightArea);
        return response;
    }

    private static List<TagPositionResponse> toResponse(List<TagPositionRequest> requests, Yard yard) {
        return requests.stream().map(request -> toResponse(request, yard)).collect(Collectors.toList());
    }

}
