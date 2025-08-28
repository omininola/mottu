package br.com.otaviomiklos.mottu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.otaviomiklos.mottu.entity.SubsidiaryTag;

@Repository
public interface SubsidiaryTagRepository extends MongoRepository<SubsidiaryTag, Long> {   
}
