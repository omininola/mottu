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

import br.com.otaviomiklos.mottu.dto.yard.YardRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardCameraResponse;
import br.com.otaviomiklos.mottu.dto.yard.YardMongoRequest;
import br.com.otaviomiklos.mottu.dto.yard.YardMongoResponse;
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
    public ResponseEntity<YardResponse> readById(@PathVariable Long id) {
        YardResponse response = service.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<YardResponse> update(@Valid @RequestBody YardRequest request, @PathVariable Long id) {
        YardResponse response = service.update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<YardResponse> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Tag Related
    @PostMapping("/{id}/tags")
    public ResponseEntity<YardMongoResponse> updateSubsidiaryTagPositions(@RequestBody YardMongoRequest request, @PathVariable Long id) {
        YardMongoResponse response = service.postOrUpdatePositions(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}/tags")
    public ResponseEntity<YardMongoResponse> readTags(@PathVariable Long id) {
        YardMongoResponse response = service.readAllFromYard(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Camera Related
    @GetMapping("/{id}/cameras")
    public ResponseEntity<YardCameraResponse> readCameras(@PathVariable Long id) {
        YardCameraResponse response = service.readCameras(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
