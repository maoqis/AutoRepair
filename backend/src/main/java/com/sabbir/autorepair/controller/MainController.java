package com.sabbir.autorepair.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MainController {
    @RequestMapping(value = "/ping", method = RequestMethod.GET)
    public String test() {
        return "Pong";
    }

}
