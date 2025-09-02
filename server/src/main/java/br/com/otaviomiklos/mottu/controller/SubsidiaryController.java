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

import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryRequest;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryResponse;
import br.com.otaviomiklos.mottu.dto.subsidiary.SubsidiaryTags;
import br.com.otaviomiklos.mottu.service.SubsidiaryService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/subsidiaries")
public class SubsidiaryController {
    
    @Autowired
    private SubsidiaryService service;

    @PostMapping
    public ResponseEntity<SubsidiaryResponse> create(@Valid @RequestBody SubsidiaryRequest request) {
        SubsidiaryResponse response = service.save(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubsidiaryResponse>> readll() {
        List<SubsidiaryResponse> responses = service.findAll();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> readById(@PathVariable Long id) {
        SubsidiaryResponse response = service.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> update(@Valid @RequestBody SubsidiaryRequest request, @PathVariable Long id) {
        SubsidiaryResponse response = service.update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<SubsidiaryResponse> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("{id}/tags")
    public ResponseEntity<SubsidiaryTags> readSubsidiaryYardTags(@PathVariable Long id) {
        SubsidiaryTags response = service.findSubsidiaryYardTags(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
