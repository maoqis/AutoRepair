package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.UserPassword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPasswordRepository extends JpaRepository<UserPassword, Long> {
    UserPassword findByUserId(Long id);
}
