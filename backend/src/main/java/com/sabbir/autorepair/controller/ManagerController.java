package com.sabbir.autorepair.controller;

import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
    @Autowired
    private UserService userService;

    @RequestMapping(method = RequestMethod.GET)
    public List<User> getAllUsers() {
        final List<User> users = new ArrayList<>();
        return users;
    }

    @RequestMapping(method = RequestMethod.POST)
    public User createManager(@RequestBody User user) {
        User newUser = userService.createManager(user);
        return newUser;
    }
}
