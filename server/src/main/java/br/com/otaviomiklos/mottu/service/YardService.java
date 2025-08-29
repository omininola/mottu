package br.com.otaviomiklos.mottu.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.entity.Yard;
import br.com.otaviomiklos.mottu.repository.YardRepository;

@Service
public class YardService {
    
    @Autowired
    private YardRepository repository;

    public YardResponse save(YardRequest request) {
        Yard yard = repository.save(toYard(request));
        return toResponse(yard);
    }

    public List<YardResponse> findAll() {
        List<Yard> yards = repository.findAll();
        return toResponse(yards);
    }

    public Optional<YardResponse> findById(Long id) {
        Optional<Yard> yard = repository.findById(id);
        return Optional.ofNullable(toResponse(yard.get()));
    }

    public Optional<YardResponse> update(YardRequest request, Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) return null;

        Yard newYard = toYard(request);
        newYard.setId(id);

        Yard savedYard = repository.save(newYard);
        return Optional.of(toResponse(savedYard));
    }

    public boolean delete(Long id) {
        Optional<Yard> yard = repository.findById(id);
        if (yard.isEmpty()) return false;
        
        repository.deleteById(id);
        return true;
    }

    public static YardResponse toResponse(Yard yard) {
        YardResponse response = new YardResponse();
        return response;
    }

    public static List<YardResponse> toResponse(List<Yard> yards) {
        return yards.stream().map(YardService::toResponse).collect(Collectors.toList());
    }

    public static Yard toYard(YardRequest request) {
        Yard yard = new Yard();
        return yard;
    }
}
