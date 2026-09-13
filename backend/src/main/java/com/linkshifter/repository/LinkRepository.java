package com.linkshifter.repository;

import com.linkshifter.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {
    Optional<Link> findByAlias(String alias);
    boolean existsByAlias(String alias);
}
