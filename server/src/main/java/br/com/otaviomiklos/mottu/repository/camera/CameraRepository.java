package br.com.otaviomiklos.mottu.repository.camera;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.camera.Camera;

@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {
}
