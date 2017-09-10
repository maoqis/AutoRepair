package com.sabbir.autorepair.service;

import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public User createManager(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("manager");
        userRepository.save(user);
        User newUser = userRepository.findByUsername(user.getUsername());
        return newUser;
    }

    public User createUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("user");
        userRepository.save(user);
        User newUser = userRepository.findByUsername(user.getUsername());
        return newUser;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
