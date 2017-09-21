package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.Repair;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairRepository extends JpaRepository<Repair, Long> {
}
