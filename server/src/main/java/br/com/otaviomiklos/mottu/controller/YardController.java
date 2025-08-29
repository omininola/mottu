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

import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.service.YardService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/yards")
public class YardController {

    @Autowired
    private YardService service;
 
    @PostMapping
    public ResponseEntity<YardResponse> create(@Valid @RequestBody YardRequest request) {
        YardResponse response = service.save(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<YardResponse>> readll() {
        List<YardResponse> responses = service.findAll();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<YardResponse> readById(@RequestParam Long id) {
        Optional<YardResponse> response = service.findById(id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response.get(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<YardResponse> update(@Valid @RequestBody YardRequest request, @RequestParam Long id) {
        Optional<YardResponse> response = service.update(request, id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response.get(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<YardResponse> delete(@RequestParam Long id) {
        boolean wasDeleted = service.delete(id);
        if (!wasDeleted) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
