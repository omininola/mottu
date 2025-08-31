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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagRequest;
import br.com.otaviomiklos.mottu.dto.apriltag.ApriltagResponse;
import br.com.otaviomiklos.mottu.exception.UnableToProcessImage;
import br.com.otaviomiklos.mottu.service.ApriltagService;
import br.com.otaviomiklos.mottu.service.ImageSenderService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/apriltags")
public class ApriltagController {
    
    @Autowired
    private ApriltagService service;

    @Autowired
    private ImageSenderService imageService;

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
    public ResponseEntity<ApriltagResponse> readById(@PathVariable Long id) {
        ApriltagResponse response = service.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApriltagResponse> update(@Valid @RequestBody ApriltagRequest request, @PathVariable Long id) {
        ApriltagResponse response = service.update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApriltagResponse> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Tag Recognition
    @PostMapping("/detect")
    public ResponseEntity<String> recognize(@RequestParam("file") MultipartFile file) {
        ResponseEntity<String> response;
        try {
            response = imageService.sendImage(file.getBytes(), file.getOriginalFilename());
        } catch (Exception ex) {
            throw new UnableToProcessImage("Não foi possível processar a imagem");
        }
        return response;
    }

}
