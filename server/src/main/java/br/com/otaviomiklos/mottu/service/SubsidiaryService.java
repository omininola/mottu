package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;

@Service
public class SubsidiaryService {
    
    @Autowired
    private SubsidiaryRepository repository;

    public SubsidiaryResponse save(SubsidiaryRequest request) {
        Subsidiary subsidiary = repository.save(toSubsidiary(request));
        return toResponse(subsidiary);
    }

    public List<SubsidiaryResponse> findAll() {
        List<Subsidiary> subsidiaries = repository.findAll();
        return toResponse(subsidiaries);
    }

    public Optional<SubsidiaryResponse> findById(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        return Optional.ofNullable(toResponse(subsidiary.get()));
    }

    public Optional<SubsidiaryResponse> update(SubsidiaryRequest request, Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) return null;

        Subsidiary newSubsidiary = toSubsidiary(request);
        newSubsidiary.setId(id);

        Subsidiary savedSubsidiary = repository.save(newSubsidiary);
        return Optional.of(toResponse(savedSubsidiary));
    }

    public boolean delete(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) return false;
        
        repository.deleteById(id);
        return true;
    }

    private static SubsidiaryResponse toResponse(Subsidiary subsidiary) {
        SubsidiaryResponse response = new SubsidiaryResponse();
        return response;
    }

    private static List<SubsidiaryResponse> toResponse(List<Subsidiary> subsidiaries) {
        return subsidiaries.stream().map(SubsidiaryService::toResponse).collect(Collectors.toList());
    }

    private static Subsidiary toSubsidiary(SubsidiaryRequest request) {
        Subsidiary subsidiary = new Subsidiary();
        return subsidiary;
    }
}
