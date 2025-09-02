package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryTags;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.mapper.SubsidiaryMapper;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;

@Service
public class SubsidiaryService {
    
    @Autowired
    private SubsidiaryRepository repository;

    @Autowired
    private SubsidiaryMapper mapper;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";

    public SubsidiaryResponse save(SubsidiaryRequest request) {
        Subsidiary subsidiary = repository.save(mapper.toEntity(request));
        return mapper.toResponse(subsidiary);
    }

    public List<SubsidiaryResponse> findAll() {
        List<Subsidiary> subsidiaries = repository.findAll();
        return mapper.toResponse(subsidiaries);
    }

    public SubsidiaryResponse findById(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return mapper.toResponse(subsidiary.get());
    }

    public SubsidiaryResponse update(SubsidiaryRequest request, Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Subsidiary newSubsidiary = mapper.toEntity(request);
        newSubsidiary.setId(id);

        Subsidiary savedSubsidiary = repository.save(newSubsidiary);
        return mapper.toResponse(savedSubsidiary);
    }

    public void delete(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public SubsidiaryTags findSubsidiaryYardTags(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        return mapper.toTagResponse(subsidiary.get());
    }
}
