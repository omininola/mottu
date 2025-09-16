package br.com.otaviomiklos.mottu.repository.camera;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.camera.CameraMongo;

@Repository
public interface CameraMongoRepository extends MongoRepository<CameraMongo, String> {
    Optional<CameraMongo> findByMysqlId(Long mysqlId);
}
