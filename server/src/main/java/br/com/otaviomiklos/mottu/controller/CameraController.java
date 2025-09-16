package br.com.otaviomiklos.mottu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import br.com.otaviomiklos.mottu.dto.camera.CameraRequest;
import br.com.otaviomiklos.mottu.dto.camera.CameraResponse;
import br.com.otaviomiklos.mottu.service.CameraService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/cameras")
public class CameraController {
    
    @Autowired
    private CameraService service;

    @PostMapping
    public ResponseEntity<CameraResponse> create(@Valid @RequestBody CameraRequest request) {
        CameraResponse response = service.save(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CameraResponse>> readll() {
        List<CameraResponse> responses = service.findAll();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CameraResponse> readById(@PathVariable Long id) {
        CameraResponse response = service.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CameraResponse> update(@Valid @RequestBody CameraRequest request, @PathVariable Long id) {
        CameraResponse response = service.update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CameraResponse> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
