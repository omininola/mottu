package br.com.otaviomiklos.mottu.controller;

import java.util.List;
import java.util.Optional;

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
import br.com.otaviomiklos.mottu.dto.bike.BikeResponse;
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
    public ResponseEntity<BikeResponse> create(@Valid @RequestBody BikeRequest request) {
        BikeResponse bike = service.save(request);
        return new ResponseEntity<>(bike, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BikeResponse>> readll() {
        List<BikeResponse> bikes = service.findAll();
        return new ResponseEntity<>(bikes, HttpStatus.OK);
    }

    @GetMapping("/plate/{plate}")
    public ResponseEntity<BikeResponse> readByPlate(@RequestParam String plate) {
        Optional<BikeResponse> bike = service.findByPlate(plate);
        if (bike.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(bike.get(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BikeResponse>> readByFilter(@PathVariable AreaStatus status, @PathVariable BikeModel model) {
        List<BikeResponse> bikes = service.findByFilter(status, model);
        return new ResponseEntity<>(bikes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BikeResponse> readById(@RequestParam Long id) {
        Optional<BikeResponse> bike = service.findById(id);
        if (bike.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(bike.get(), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BikeResponse> update(@Valid @RequestBody BikeRequest request, @RequestParam Long id) {
        Optional<BikeResponse> bike = service.update(request, id);
        if (bike.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(bike.get(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BikeResponse> delete(@RequestParam Long id) {
        boolean wasDeleted = service.delete(id);
        if (!wasDeleted) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Link tag
    @PostMapping("/{id}/tag/{tagId}")
    public ResponseEntity<BikeResponse> linkBikeToTag(@RequestParam Long id, @RequestParam Long tagId) {
        boolean wasLinked = service.linkBikeToTag(id, tagId);
        if (!wasLinked) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Unlink tag
    @DeleteMapping("/{id}/tag")
    public ResponseEntity<BikeResponse> unlinkBikeFromTag(@RequestParam Long id) {
        boolean wasUnlinked = service.unlinkBikeFromTag(id);
        if (!wasUnlinked) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
