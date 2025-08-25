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
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.BikeRepository;

@Service
public class BikeService {
    
    @Autowired
    private BikeRepository repository;

    @Autowired
    private ApriltagRepository tagRepository;

    public BikeResponse save(BikeRequest request) {
        Bike bike = repository.save(toBike(request));
        return toResponse(bike);
    }

    public List<BikeResponse> findAll() {
        List<Bike> bikes = repository.findAll();
        return toResponse(bikes);
    }

    public Optional<BikeResponse> findByPlate(String plate) {
        Optional<Bike> bike = repository.findByPlate(plate);
        return Optional.ofNullable(toResponse(bike.get()));
    }

    public List<BikeResponse> findByFilter(AreaStatus status, BikeModel model) {
        List<Bike> bikes = repository.findByStatusAndModel(status, model);
        return toResponse(bikes);
    }

    public Optional<BikeResponse> findById(Long id) {
        Optional<Bike> bike = repository.findById(id);
        return Optional.ofNullable(toResponse(bike.get()));
    }

    public Optional<BikeResponse> update(BikeRequest request, Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) return null;

        Bike newBike = toBike(request);
        newBike.setId(id);

        Bike savedBike = repository.save(newBike);
        return Optional.of(toResponse(savedBike));
    }

    public boolean delete(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) return false;
        
        repository.deleteById(id);
        return true;
    }

    public boolean linkBikeToTag(Long id, Long tagId) {
        Optional<Bike> bike = repository.findById(id);
        Optional<Apriltag> tag = tagRepository.findById(id);

        if (bike.isEmpty() || tag.isEmpty()) return false;

        bike.get().setTag(tag.get());
        
        repository.save(bike.get());
        return true;
    }

    public boolean unlinkBikeFromTag(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) return false;

        bike.get().setTag(null);
        
        repository.save(bike.get());
        return true;
    }

    private static BikeResponse toResponse(Bike bike) {
        BikeResponse response = new BikeResponse();
        return response;
    }

    private static List<BikeResponse> toResponse(List<Bike> bikes) {
        return bikes.stream().map(BikeService::toResponse).collect(Collectors.toList());
    }

    private static Bike toBike(BikeRequest request) {
        Bike bike = new Bike();
        return bike;
    }
}
