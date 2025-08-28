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

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.service.ApriltagService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/apriltags")
public class ApriltagController {
    
    @Autowired
    private ApriltagService service;

    @PostMapping
    public ResponseEntity<ApriltagResponse> create(@Valid @RequestBody ApriltagRequest request) {
        ApriltagResponse response = service.save(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ApriltagResponse>> readll() {
        List<ApriltagResponse> responses = service.findAll();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApriltagResponse> readById(@RequestParam Long id) {
        Optional<ApriltagResponse> response = service.findById(id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response.get(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApriltagResponse> update(@Valid @RequestBody ApriltagRequest request, @RequestParam Long id) {
        Optional<ApriltagResponse> response = service.update(request, id);
        if (response.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApriltagResponse> delete(@RequestParam Long id) {
        boolean wasDeleted = service.delete(id);
        if (!wasDeleted) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
