package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByUsername(String username);

    User findById(Long id);

    List<User> findByRole(String role);
}
