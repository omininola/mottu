package br.com.otaviomiklos.mottu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.Bike;
import br.com.otaviomiklos.mottu.enums.AreaStatus;
import br.com.otaviomiklos.mottu.enums.BikeModel;

import java.util.Optional;
import java.util.List;


@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {
    Optional<Bike> findByPlate(String plate);
    List<Bike> findByStatusAndModel(AreaStatus status, BikeModel model);
}
