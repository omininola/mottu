package br.com.otaviomiklos.mottu.controller;

import java.util.List;

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
import jakarta.validation.Valid;

@RestController
@RequestMapping("/apriltags")
public class ApriltagController {
    
    @PostMapping
    public ResponseEntity<ApriltagResponse> create(@Valid @RequestBody ApriltagRequest request) {
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ApriltagResponse>> readll() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApriltagResponse> readById(@RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApriltagResponse> update(@Valid @RequestBody ApriltagRequest request, @RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApriltagResponse> delete(@RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
