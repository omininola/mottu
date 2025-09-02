package br.com.otaviomiklos.mottu.mapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.entity.Apriltag;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;

@Component
public class ApriltagMapper {

    @Autowired
    private SubsidiaryRepository subsidiaryRepository;

    private final String SUBSIDIARY_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";
    
    public ApriltagResponse toResponse(Apriltag apriltag) {
        String bikePlate = null;
        if (apriltag.getBike() != null) bikePlate = apriltag.getBike().getPlate();

        ApriltagResponse response = new ApriltagResponse();
        response.setId(apriltag.getId());
        response.setCode(apriltag.getCode());
        response.setBike(bikePlate);
        response.setSubsidiary(apriltag.getSubsidiary().getName());
        return response;
    }

    public List<ApriltagResponse> toResponse(List<Apriltag> apriltags) {
        return apriltags.stream().map(apriltag -> toResponse(apriltag)).collect(Collectors.toList());
    }

    public Apriltag toEntity(ApriltagRequest request) {
        Optional<Subsidiary> subsidiary = subsidiaryRepository.findById(request.getSubsidiaryId());
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(SUBSIDIARY_NOT_FOUND_MESSAGE);

        Apriltag apriltag = new Apriltag();
        apriltag.setCode(request.getCode());
        apriltag.setSubsidiary(subsidiary.get());
        return apriltag;
    }

}
