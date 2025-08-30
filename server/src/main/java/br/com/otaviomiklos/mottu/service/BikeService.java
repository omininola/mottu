package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.bike.BikeRequest;
import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import br.com.otaviomiklos.mottu.exception.AlreadyLinkedException;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.BikeRepository;

@Service
public class BikeService {
    
    @Autowired
    private BikeRepository repository;

    @Autowired
    private ApriltagRepository tagRepository;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma moto com esse ID";
    private static final String TAG_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma tag com esse ID";
    private static final String BOTH_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma moto com esse ID e nem uma tag com o ID passado";
    private static final String ALREADY_LINKED_MESSAGE = "A moto já está vinculada a uma outra tag";
    private static final String TAG_ALREADY_LINKED_MESSAGE = "A tag já está vinculada a uma outra moto";

    public BikeResponse save(BikeRequest request) {
        Bike bike = repository.save(toBike(request));
        return toResponse(bike);
    }

    public List<BikeResponse> findAll() {
        List<Bike> bikes = repository.findAll();
        return toResponse(bikes);
    }

    public BikeResponse findByPlate(String plate) {
        Optional<Bike> bike = repository.findByPlate(plate);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(bike.get());
    }

    public List<BikeResponse> findByFilter(AreaStatus status, BikeModel model) {
        List<Bike> bikes = repository.findByStatusAndModel(status, model);
        return toResponse(bikes);
    }

    public BikeResponse findById(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(bike.get());
    }

    public BikeResponse update(BikeRequest request, Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Bike newBike = toBike(request);
        newBike.setId(id);

        Bike savedBike = repository.save(newBike);
        return toResponse(savedBike);
    }

    public void delete(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public void linkBikeToTag(Long id, Long tagId) {
        Optional<Bike> bike = repository.findById(id);
        Optional<Apriltag> tag = tagRepository.findById(tagId);

        boolean hasBike = bike.isPresent();
        boolean hasTag = tag.isPresent();

        if (!hasBike && !hasTag) throw new ResourceNotFoundException(BOTH_NOT_FOUND_MESSAGE);
        if (!hasBike && hasTag) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        if (hasBike && !hasTag) throw new ResourceNotFoundException(TAG_NOT_FOUND_MESSAGE);
        
        if (bike.get().getTag() != null) throw new AlreadyLinkedException(ALREADY_LINKED_MESSAGE);
        if (tag.get().getBike() != null) throw new AlreadyLinkedException(TAG_ALREADY_LINKED_MESSAGE);

        bike.get().setTag(tag.get());        
        repository.save(bike.get());
    }

    public void unlinkBikeFromTag(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        bike.get().setTag(null);
        
        repository.save(bike.get());
    }

    public static BikeResponse toResponse(Bike bike) {
        String tagCode = null;
        if (bike.getTag() != null) tagCode = bike.getTag().getCode();

        BikeResponse response = new BikeResponse();
        response.setId(bike.getId());
        response.setPlate(bike.getPlate());
        response.setChassis(bike.getChassis());
        response.setModel(bike.getModel());
        response.setStatus(bike.getStatus());
        response.setTagCode(tagCode);
        return response;
    }

    public static List<BikeResponse> toResponse(List<Bike> bikes) {
        return bikes.stream().map(BikeService::toResponse).collect(Collectors.toList());
    }

    public Bike toBike(BikeRequest request) {
        Bike bike = new Bike();
        bike.setPlate(request.getPlate());
        bike.setChassis(request.getChassis());
        bike.setModel(request.getModel());
        bike.setStatus(request.getStatus());
        return bike;
    }
}
