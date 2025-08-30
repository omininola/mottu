package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;

@Service
public class ApriltagService {
    
    @Autowired
    private ApriltagRepository repository;

    @Autowired
    private SubsidiaryRepository subsidiaryRepository;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma apriltag com esse ID";
    private static final String SUBSIDIARY_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";

    public ApriltagResponse save(ApriltagRequest request) {
        Apriltag apriltag = repository.save(toApriltag(request));
        return toResponse(apriltag);
    }

    public List<ApriltagResponse> findAll() {
        List<Apriltag> apriltags = repository.findAll();
        return toResponse(apriltags);
    }

    public ApriltagResponse findById(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(apriltag.get());
    }

    public ApriltagResponse update(ApriltagRequest request, Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Apriltag newApriltag = toApriltag(request);
        newApriltag.setId(id);

        Apriltag savedApriltag = repository.save(newApriltag);
        return toResponse(savedApriltag);
    }

    public void delete(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public static ApriltagResponse toResponse(Apriltag apriltag) {
        String bikePlate = null;
        if (apriltag.getBike() != null) bikePlate = apriltag.getBike().getPlate();

        ApriltagResponse response = new ApriltagResponse();
        response.setId(apriltag.getId());
        response.setCode(apriltag.getCode());
        response.setBike(bikePlate);
        response.setSubsiadiary(apriltag.getSubsidiary().getName());
        return response;
    }

    public static List<ApriltagResponse> toResponse(List<Apriltag> apriltags) {
        return apriltags.stream().map(ApriltagService::toResponse).collect(Collectors.toList());
    }

    public Apriltag toApriltag(ApriltagRequest request) {
        Optional<Subsidiary> subsidiary = subsidiaryRepository.findById(request.getSubsidiaryId());
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(SUBSIDIARY_NOT_FOUND_MESSAGE);

        Apriltag apriltag = new Apriltag();
        apriltag.setCode(request.getCode());
        apriltag.setSubsidiary(subsidiary.get());
        return apriltag;
    }
}
