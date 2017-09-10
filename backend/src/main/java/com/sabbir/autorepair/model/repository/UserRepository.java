package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
