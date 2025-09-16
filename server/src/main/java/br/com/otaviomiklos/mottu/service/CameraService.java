package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.camera.CameraRequest;
import br.com.otaviomiklos.mottu.dto.camera.CameraResponse;
import br.com.otaviomiklos.mottu.entity.camera.Camera;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.CameraMapper;
import br.com.otaviomiklos.mottu.repository.camera.CameraMongoRepository;
import br.com.otaviomiklos.mottu.repository.camera.CameraRepository;

@Service
public class CameraService {
    
    @Autowired
    private CameraRepository repository;

    @Autowired
    private CameraMongoRepository mongoRepository;

    @Autowired
    private CameraMapper mapper;

    private final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma câmera com esse ID";

    public CameraResponse save(CameraRequest request) {
        Camera camera = repository.save(mapper.toEntity(request));
        mongoRepository.save(mapper.toMongoEntity(request, camera.getId())); 
        return mapper.toResponse(camera);
    }

    public List<CameraResponse> findAll() {
        List<Camera> cameras = repository.findAll();
        return mapper.toResponse(cameras);
    }

    public CameraResponse findById(Long id) {
        Optional<Camera> camera = repository.findById(id);
        if (camera.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(camera.get());
    }

    public CameraResponse update(CameraRequest request, Long id) {
        Optional<Camera> camera = repository.findById(id);
        if (camera.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Camera newCamera = mapper.toEntity(request);
        newCamera.setId(id);

        Camera savedCamera = repository.save(newCamera);
        return mapper.toResponse(savedCamera);
    }

    public void delete(Long id) {
        Optional<Camera> camera = repository.findById(id);
        if (camera.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }
}
