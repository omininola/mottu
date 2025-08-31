package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.ApriltagMapper;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;

@Service
public class ApriltagService {
    
    @Autowired
    private ApriltagRepository repository;

    @Autowired
    private ApriltagMapper mapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma apriltag com esse ID";

    public ApriltagResponse save(ApriltagRequest request) {
        Apriltag apriltag = repository.save(mapper.toEntity(request));
        return mapper.toResponse(apriltag);
    }

    public List<ApriltagResponse> findAll() {
        List<Apriltag> apriltags = repository.findAll();
        return mapper.toResponse(apriltags);
    }

    public ApriltagResponse findById(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(apriltag.get());
    }

    public ApriltagResponse update(ApriltagRequest request, Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Apriltag newApriltag = mapper.toEntity(request);
        newApriltag.setId(id);

        Apriltag savedApriltag = repository.save(newApriltag);
        return mapper.toResponse(savedApriltag);
    }

    public void delete(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }
}
