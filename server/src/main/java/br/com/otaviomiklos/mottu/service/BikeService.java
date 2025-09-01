package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.bike.BikeRequest;
import br.com.otaviomiklos.mottu.dto.bike.BikeDetailsDTO;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import br.com.otaviomiklos.mottu.exception.AlreadyLinkedException;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.BikeMapper;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.BikeRepository;

@Service
public class BikeService {
    
    @Autowired
    private BikeRepository repository;

    @Autowired
    private ApriltagRepository tagRepository;

    @Autowired
    private BikeMapper mapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma moto com esse ID";
    private static final String PLATE_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma moto com essa placa";
    private static final String TAG_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma tag com esse código dentro dessa filial";
    private static final String BOTH_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma moto com essa placa e nem uma tag com o código passado";
    private static final String BIKE_ALREADY_LINKED_MESSAGE = "A moto já está vinculada a uma outra tag";
    private static final String TAG_ALREADY_LINKED_MESSAGE = "A tag já está vinculada a uma outra moto";
    private static final String ALREADY_LINKED_MESSAGE = "A moto já está vinculada a está tag";

    public BikeDetailsDTO save(BikeRequest request) {
        Bike bike = repository.save(mapper.toEntity(request));
        return mapper.toResponse(bike);
    }

    public List<BikeDetailsDTO> findAll() {
        List<Bike> bikes = repository.findAll();
        return mapper.toResponse(bikes);
    }

    public BikeDetailsDTO findByPlate(String plate) {
        Optional<Bike> bike = repository.findByPlate(plate);
        if (bike.isEmpty()) throw new ResourceNotFoundException(PLATE_NOT_FOUND_MESSAGE);
        return mapper.toResponse(bike.get());
    }

    public List<BikeDetailsDTO> findByFilter(AreaStatus status, BikeModel model) {
        List<Bike> bikes = repository.findByStatusAndModel(status, model);
        return mapper.toResponse(bikes);
    }

    public BikeDetailsDTO findById(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(bike.get());
    }

    public BikeDetailsDTO update(BikeRequest request, Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Bike newBike = mapper.toEntity(request);
        newBike.setId(id);

        Bike savedBike = repository.save(newBike);
        return mapper.toResponse(savedBike);
    }

    public void delete(Long id) {
        Optional<Bike> bike = repository.findById(id);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public void linkBikeToTag(String plate, String tagCode, Long subsidiaryId) {
        Optional<Bike> bike = repository.findByPlate(plate);
        Optional<Apriltag> tag = tagRepository.findByCodeAndSubsidiaryId(tagCode, subsidiaryId);

        boolean hasBike = bike.isPresent();
        boolean hasTag = tag.isPresent();

        if (!hasBike && !hasTag) throw new ResourceNotFoundException(BOTH_NOT_FOUND_MESSAGE);
        if (!hasBike && hasTag) throw new ResourceNotFoundException(PLATE_NOT_FOUND_MESSAGE);
        if (hasBike && !hasTag) throw new ResourceNotFoundException(TAG_NOT_FOUND_MESSAGE);

        if (bike.get().getTag() != null
        && bike.get().getTag().getCode() == tag.get().getCode() 
        && bike.get().getTag().getSubsidiary().getId() == tag.get().getSubsidiary().getId()) {
            throw new AlreadyLinkedException(ALREADY_LINKED_MESSAGE); 
        }

        if (bike.get().getTag() != null) throw new AlreadyLinkedException(BIKE_ALREADY_LINKED_MESSAGE);
        if (tag.get().getBike() != null) throw new AlreadyLinkedException(TAG_ALREADY_LINKED_MESSAGE);

        bike.get().setTag(tag.get());
        repository.save(bike.get());
    }

    public void unlinkBikeFromTag(String plate) {
        Optional<Bike> bike = repository.findByPlate(plate);
        if (bike.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Bike bikeToSave = bike.get();
        bikeToSave.setTag(null);
        bikeToSave.setYard(null);

        repository.save(bikeToSave);
    }
}
