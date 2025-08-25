package br.com.otaviomiklos.mottu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.Area;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
}
