package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.RepairComments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairCommentsRepository extends JpaRepository<RepairComments, Long> {
}
