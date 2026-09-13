package com.linkshifter.repository;

import com.linkshifter.model.Click;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {
    List<Click> findByAlias(String alias);
    long countByAlias(String alias);
}
