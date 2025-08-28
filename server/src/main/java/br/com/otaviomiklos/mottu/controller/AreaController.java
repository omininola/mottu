package br.com.otaviomiklos.mottu.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.otaviomiklos.mottu.dto.area.AreaRequest;
import br.com.otaviomiklos.mottu.dto.area.AreaResponse;
import br.com.otaviomiklos.mottu.service.AreaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/areas")
public class AreaController {
    
    @Autowired
    private AreaService service;

    @PostMapping
    public ResponseEntity<AreaResponse> create(@Valid @RequestBody AreaRequest request) {
        AreaResponse response = service.save(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AreaResponse>> readll() {
        List<AreaResponse> responses = service.findAll();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaResponse> readById(@RequestParam Long id) {
        Optional<AreaResponse> response = service.findById(id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response.get(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AreaResponse> update(@Valid @RequestBody AreaRequest request, @RequestParam Long id) {
        Optional<AreaResponse> response = service.update(request, id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response.get(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<AreaResponse> delete(@RequestParam Long id) {
        boolean wasDeleted = service.delete(id);
        if (!wasDeleted) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
