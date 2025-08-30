package br.com.otaviomiklos.mottu.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.YardTag;

@Repository
public interface YardTagRepository extends MongoRepository<YardTag, String> {
    Optional<YardTag> findByMysqlYardId (Long mysqlYardId);
}
