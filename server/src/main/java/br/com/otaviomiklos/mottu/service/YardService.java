package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.Yard;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;
import br.com.otaviomiklos.mottu.repository.YardRepository;

@Service
public class YardService {
    
    @Autowired
    private YardRepository repository;
    
    @Autowired
    private static SubsidiaryRepository subsidiaryRepository;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar um pátio com esse ID";
    private static final String SUBSIDIARY_NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";

    public YardResponse save(YardRequest request) {
        Yard yard = repository.save(toYard(request));
        return toResponse(yard);
    }

    public List<YardResponse> findAll() {
        List<Yard> yards = repository.findAll();
        return toResponse(yards);
    }

    public YardResponse findById(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(yard.get());
    }

    public YardResponse update(YardRequest request, Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Yard newYard = toYard(request);
        newYard.setId(id);

        Yard savedYard = repository.save(newYard);
        return toResponse(savedYard);
    }

    public void delete(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public static YardResponse toResponse(Yard yard) {
        YardResponse response = new YardResponse();
        response.setId(yard.getId());
        response.setName(yard.getName());
        response.setAreas(AreaService.toResponse(yard.getAreas()));
        response.setSubsidiary(yard.getSubsidiary().getName());
        return response;
    }

    public static List<YardResponse> toResponse(List<Yard> yards) {
        return yards.stream().map(YardService::toResponse).collect(Collectors.toList());
    }

    public static Yard toYard(YardRequest request) {
        Optional<Subsidiary> subsidiary = subsidiaryRepository.findById(request.getSubsidiaryId());
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(SUBSIDIARY_NOT_FOUND_MESSAGE);

        Yard yard = new Yard();
        yard.setName(request.getName());
        yard.setSubsidiary(subsidiary.get());
        return yard;
    }
}
