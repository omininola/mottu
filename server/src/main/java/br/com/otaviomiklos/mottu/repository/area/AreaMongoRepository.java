package br.com.otaviomiklos.mottu.repository.area;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.area.AreaMongo;

@Repository
public interface AreaMongoRepository extends MongoRepository<AreaMongo, String> {
    Optional<AreaMongo> findByMysqlId(Long mysqlId);
}
