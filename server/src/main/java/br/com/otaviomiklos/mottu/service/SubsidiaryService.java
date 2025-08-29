package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.address.AddressRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.entity.Address;
import br.com.otaviomiklos.mottu.entity.Subsidiary;
import br.com.otaviomiklos.mottu.exception.ResourceNotFoundException;
import br.com.otaviomiklos.mottu.repository.SubsidiaryRepository;

@Service
public class SubsidiaryService {
    
    @Autowired
    private SubsidiaryRepository repository;

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
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        return toResponse(subsidiary.get());
    }

    public SubsidiaryResponse update(SubsidiaryRequest request, Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);

        Subsidiary newSubsidiary = toSubsidiary(request);
        newSubsidiary.setId(id);

        Subsidiary savedSubsidiary = repository.save(newSubsidiary);
        return toResponse(savedSubsidiary);
    }

    public void delete(Long id) {
        Optional<Subsidiary> subsidiary = repository.findById(id);
        if (subsidiary.isEmpty()) throw new ResourceNotFoundException(NOT_FOUND_MESSAGE);
        
        repository.deleteById(id);
    }

    public static SubsidiaryResponse toResponse(Subsidiary subsidiary) {
        SubsidiaryResponse response = new SubsidiaryResponse();
        response.setId(subsidiary.getId());
        response.setName(subsidiary.getName());
        response.setAddress(subsidiary.getAddress().toString());
        response.setTags(subsidiary.getApriltags());
        response.setYards(subsidiary.getYards());
        return response;
    }

    public static List<SubsidiaryResponse> toResponse(List<Subsidiary> subsidiaries) {
        return subsidiaries.stream().map(SubsidiaryService::toResponse).collect(Collectors.toList());
    }

    public static Subsidiary toSubsidiary(SubsidiaryRequest request) {
        Address address = new Address();
        AddressRequest addressRequest = request.getAddress();
        address.setStreet(addressRequest.getStreet());
        address.setZipCode(addressRequest.getZipCode());
        address.setCity(addressRequest.getCity());
        address.setState(addressRequest.getState());
        address.setCountry(addressRequest.getCountry());
        
        Subsidiary subsidiary = new Subsidiary();
        subsidiary.setName(request.getName());
        subsidiary.setAddress(address);
        return subsidiary;
    }
}
