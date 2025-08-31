package br.com.otaviomiklos.mottu.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.YardMongo;

@Repository
public interface YardMongoRepository extends MongoRepository<YardMongo, String> {
    Optional<YardMongo> findByMysqlId (Long mysqlId);
}
