package br.com.otaviomiklos.mottu.repository.area;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.area.Area;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
}
