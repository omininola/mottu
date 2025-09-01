package br.com.otaviomiklos.mottu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.otaviomiklos.mottu.dto.bike.BikeRequest;
import br.com.otaviomiklos.mottu.dto.bike.BikeDetailsDTO;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;
import br.com.otaviomiklos.mottu.service.BikeService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/bikes")
public class BikeController {
    
    @Autowired
    private BikeService service;

    @PostMapping
    public ResponseEntity<BikeDetailsDTO> create(@Valid @RequestBody BikeRequest request) {
        BikeDetailsDTO bike = service.save(request);
        return new ResponseEntity<>(bike, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BikeDetailsDTO>> readll() {
        List<BikeDetailsDTO> bikes = service.findAll();
        return new ResponseEntity<>(bikes, HttpStatus.OK);
    }

    @GetMapping("/plate/{plate}")
    public ResponseEntity<BikeDetailsDTO> readByPlate(@PathVariable String plate) {
        BikeDetailsDTO bike = service.findByPlate(plate);
        return new ResponseEntity<>(bike, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BikeDetailsDTO>> readByFilter(@RequestParam AreaStatus status, @RequestParam BikeModel model) {
        List<BikeDetailsDTO> bikes = service.findByFilter(status, model);
        return new ResponseEntity<>(bikes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BikeDetailsDTO> readById(@PathVariable Long id) {
        BikeDetailsDTO bike = service.findById(id);
        return new ResponseEntity<>(bike, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BikeDetailsDTO> update(@Valid @RequestBody BikeRequest request, @PathVariable Long id) {
        BikeDetailsDTO bike = service.update(request, id);
        return new ResponseEntity<>(bike, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BikeDetailsDTO> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Link tag
    @PostMapping("/{plate}/tag/{tagCode}/subsidiary/{subsidiaryId}")
    public ResponseEntity<BikeDetailsDTO> linkBikeToTag(@PathVariable String plate, @PathVariable String tagCode, @PathVariable Long subsidiaryId) {
        service.linkBikeToTag(plate, tagCode, subsidiaryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Unlink tag
    @DeleteMapping("/{plate}/tag")
    public ResponseEntity<BikeDetailsDTO> unlinkBikeFromTag(@PathVariable String plate) {
        service.unlinkBikeFromTag(plate);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
