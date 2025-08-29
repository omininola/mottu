package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryTagRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryTagResponse;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.entity.SubsidiaryTag;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;
import br.com.otaviomiklos.mottu.repository.SubsidiaryTagRepository;

@Service
public class SubsidiaryService {
    
    @Autowired
    private static SubsidiaryRepository repository;

    @Autowired
    private SubsidiaryTagRepository mongoRepository;

    private static final String NOT_FOUND_MESSAGE = "Não foi possível encontrar uma filial com esse ID";

    public SubsidiaryResponse save(SubsidiaryRequest request) {
        Subsidiary subsidiary = repository.save(toSubsidiary(request));
        return toResponse(subsidiary);
    }

    public List<SubsidiaryResponse> findAll() {
        List<Subsidiary> subsidiaries = repository.findAll();
        return toResponse(subsidiaries);
    }

    public SubsidiaryResponse findById(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceAccessException(NOT_FOUND_MESSAGE);
        return toResponse(subsidiary.get());
    }

    public SubsidiaryResponse update(SubsidiaryRequest request, Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceAccessException(NOT_FOUND_MESSAGE);

        Subsidiary newSubsidiary = toSubsidiary(request);
        newSubsidiary.setId(id);

        Subsidiary savedSubsidiary = repository.save(newSubsidiary);
        return toResponse(savedSubsidiary);
    }

    public void delete(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceAccessException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    // Tag Related
    public SubsidiaryTagResponse postOrUpdatePositions(SubsidiaryTagRequest request) {
        SubsidiaryTag subsidiaryTag = mongoRepository.save(toSubsidiaryTag(request));
        return toTagResponse(subsidiaryTag);
    }

    public SubsidiaryTagResponse readAllFromSubsidiary(Long subsidiaryId) {
        Optional<SubsidiaryTag> subsidiaryTag = mongoRepository.findById(subsidiaryId);
        if (subsidiaryTag.isEmpty()) throw new ResourceAccessException(NOT_FOUND_MESSAGE);
        return toTagResponse(subsidiaryTag.get());
    }

    // TODO: WTF this method does????
    public static SubsidiaryTagResponse toTagResponse(SubsidiaryTag subsidiaryTag) {
        Optional<Subsidiary> subsidiary = repository.findById(subsidiaryTag.getSubsidiaryId());
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        SubsidiaryTagResponse response = new SubsidiaryTagResponse();
        // response.setTags(subsidiaryTag.getTags());
        return response;
    }

    // TODO: WTF part II
    public static SubsidiaryTag toSubsidiaryTag(SubsidiaryTagRequest request) {
        SubsidiaryTag subsidiaryTag = new SubsidiaryTag();
        subsidiaryTag.setSubsidiaryId(request.getSubsidiaryId());
        // subsidiaryTag.setTags(request.getTags());
        return subsidiaryTag;
    }

    public static SubsidiaryResponse toResponse(Subsidiary subsidiary) {
        SubsidiaryResponse response = new SubsidiaryResponse();
        response.setId(subsidiary.getId());
        response.setName(subsidiary.getName());
        response.setAddress(subsidiary.getAddress().toString());
        response.setTags(subsidiary.getApriltags());
        response.setYards(YardService.toResponse(subsidiary.getYards()));
        return response;
    }

    public static List<SubsidiaryResponse> toResponse(List<Subsidiary> subsidiaries) {
        return subsidiaries.stream().map(SubsidiaryService::toResponse).collect(Collectors.toList());
    }

    public static Subsidiary toSubsidiary(SubsidiaryRequest request) {
        Subsidiary subsidiary = new Subsidiary();
        subsidiary.setName(request.getName());
        return subsidiary;
    }
}
