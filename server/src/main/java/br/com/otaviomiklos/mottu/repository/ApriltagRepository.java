package br.com.otaviomiklos.mottu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.Apriltag;

@Repository
public interface ApriltagRepository extends JpaRepository<Apriltag, Long> {
    Optional<Apriltag> findByCodeAndSubsidiaryId(String code, Long yardId);
}
