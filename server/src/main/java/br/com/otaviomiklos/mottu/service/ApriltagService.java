package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.repository.ApriltagRepository;

@Service
public class ApriltagService {
    
    @Autowired
    private ApriltagRepository repository;

    public ApriltagResponse save(ApriltagRequest request) {
        Apriltag apriltag = repository.save(toApriltag(request));
        return toResponse(apriltag);
    }

    public List<ApriltagResponse> findAll() {
        List<Apriltag> apriltags = repository.findAll();
        return toResponse(apriltags);
    }

    public Optional<ApriltagResponse> findById(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        return Optional.ofNullable(toResponse(apriltag.get()));
    }

    public Optional<ApriltagResponse> update(ApriltagRequest request, Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) return null;

        Apriltag newApriltag = toApriltag(request);
        newApriltag.setId(id);

        Apriltag savedApriltag = repository.save(newApriltag);
        return Optional.of(toResponse(savedApriltag));
    }

    public boolean delete(Long id) {
        Optional<Apriltag> apriltag = repository.findById(id);
        if (apriltag.isEmpty()) return false;
        
        repository.deleteById(id);
        return true;
    }

    private static ApriltagResponse toResponse(Apriltag apriltag) {
        ApriltagResponse response = new ApriltagResponse();
        return response;
    }

    private static List<ApriltagResponse> toResponse(List<Apriltag> apriltags) {
        return apriltags.stream().map(ApriltagService::toResponse).collect(Collectors.toList());
    }

    private static Apriltag toApriltag(ApriltagRequest request) {
        Apriltag apriltag = new Apriltag();
        return apriltag;
    }
}
