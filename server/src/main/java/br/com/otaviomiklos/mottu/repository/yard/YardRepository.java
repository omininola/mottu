package br.com.otaviomiklos.mottu.repository.yard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.yard.Yard;

@Repository
public interface YardRepository extends JpaRepository<Yard, Long> {
}
