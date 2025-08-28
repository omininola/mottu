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

import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/subsidiaries")
public class SubsidiaryController {
    
    @PostMapping
    public ResponseEntity<SubsidiaryResponse> create(@Valid @RequestBody SubsidiaryRequest request) {
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubsidiaryResponse>> readll() {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> readById(@RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> update(@Valid @RequestBody SubsidiaryRequest request, @RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> delete(@RequestParam Long id) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
