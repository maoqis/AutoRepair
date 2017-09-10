package com.sabbir.autorepair.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class MainController {
    @RequestMapping("/ping")
    public String test() {
        return "Pong";
    }

}
