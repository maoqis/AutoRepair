package com.sabbir.autorepair.service;

import com.sabbir.autorepair.entity.UserWithPassword;
import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.model.UserPassword;
import com.sabbir.autorepair.model.repository.UserPasswordRepository;
import com.sabbir.autorepair.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPasswordRepository userPasswordRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public User createManager(UserWithPassword userWithPassword) {
        final User user = createUserFromUserWithPasswordWithRole(userWithPassword, "manager");
        return saveUserWithPassword(user, userWithPassword.getPassword());
    }

    public User createUser(UserWithPassword userWithPassword) {
        final User user = createUserFromUserWithPasswordWithRole(userWithPassword, "user");
        return saveUserWithPassword(user, userWithPassword.getPassword());
    }

    public User updateUser(UserWithPassword userWithPassword) {
        final User existingUser = getUserById(userWithPassword.getId());
        existingUser.setRole("manager");
        userRepository.save(existingUser);
        if (userWithPassword.getPassword() != null) {
            final UserPassword userPassword = userPasswordRepository.findByUserId(existingUser.getId());
            userPassword.setPassword(bCryptPasswordEncoder.encode(userPassword.getPassword()));
            userPasswordRepository.save(userPassword);
        }
        return userRepository.findById(userWithPassword.getId());
    }

    private User saveUserWithPassword(User user, String password) {
        final User newUser = userRepository.save(user);
        final UserPassword userPassword = new UserPassword();
        userPassword.setUserId(user.getId());
        userPassword.setPassword(bCryptPasswordEncoder.encode(password));
        userPasswordRepository.save(userPassword);
        return newUser;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllManagers() {
        return userRepository.findByRole("manager");
    }

    public void deleteUser(Long id) {
        userRepository.delete(id);
        userPasswordRepository.delete(id);
    }

    private User createUserFromUserWithPasswordWithRole(UserWithPassword userWithPassword, String role) {
        final User user = new User();
        user.setUsername(userWithPassword.getUsername());
        user.setRole(role);
        return user;
    }

}
