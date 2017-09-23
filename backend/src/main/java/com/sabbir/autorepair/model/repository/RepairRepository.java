package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.Repair;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface RepairRepository extends JpaRepository<Repair, Long> {
    List<Repair> findByDateTimeBetween(Date timeStart, Date timeEnd);

    List<Repair> findByDateTime(Date dateTime);

    List<Repair> findByAssignedUserId(Long id);

    @Override
    List<Repair> findAll();
}
