package com.sabbir.autorepair.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {
    @RequestMapping("/test")
    public String test(){
        return "Hello World";
    }

}
