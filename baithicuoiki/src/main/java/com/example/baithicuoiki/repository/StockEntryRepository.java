package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.StockEntry;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockEntryRepository extends JpaRepository<StockEntry,Long> {

}
