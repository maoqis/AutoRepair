package com.sabbir.autorepair.controller;

import com.sabbir.autorepair.entity.UserWithPassword;
import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping(method = RequestMethod.GET)
    public List<User> getAllUser() {
        final List<User> users = userService.getAllUsers();
        return users;
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<User> createUser(@RequestBody UserWithPassword user) {
        User existingUser = userService.getUserByUsername(user.getUsername());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        try {
            User newUser = userService.createUser(user);
            return new ResponseEntity<User>(newUser, HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserWithPassword user) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null
                || user.getId() == null
                || id != user.getId()
                || !existingUser.getRole().equals("user")
                || (user.getRole() != null
                && !user.getRole().isEmpty()
                && !user.getRole().equals("user")
                && !user.getRole().equals("manager"))
                ) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else if (!existingUser.getUsername().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(null);
        }
        try {
            User updatedUser = userService.updateUser(user);
            return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null || !existingUser.getRole().equals("user")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return new ResponseEntity<User>(existingUser, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        User existingUser = userService.getUserById(id);
        if (existingUser == null || !existingUser.getRole().equals("user")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            userService.deleteUser(id);
            existingUser.setId(null);
            return new ResponseEntity<User>(existingUser, HttpStatus.OK);
        }
    }
}



