package com.sabbir.autorepair.controller;

import com.sabbir.autorepair.entity.FilterRepairEntity;
import com.sabbir.autorepair.entity.RepairEntity;
import com.sabbir.autorepair.exception.TimeOverlapException;
import com.sabbir.autorepair.exception.UserNotFoundException;
import com.sabbir.autorepair.model.Repair;
import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.service.RepairService;
import com.sabbir.autorepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping(value = "/api/repair")
public class RepairController {
    private static Logger logger = Logger.getLogger(RepairController.class.getName());

    @Autowired
    private RepairService repairService;

    @Autowired
    private UserService userService;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Repair> createRepair(@RequestBody RepairEntity repairEntity) {
        logger.info(repairEntity.toString());
        final Repair repair;
        try {
            repair = repairService.createRepair(repairEntity);
        } catch (TimeOverlapException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return new ResponseEntity<Repair>(repair, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Repair>> getAllRepairs(Principal principal) {
        final User currentUser = userService.getUserByUsername(principal.getName());
        List<Repair> repairList = repairService.getAllRepairsByUser(currentUser);
        return new ResponseEntity<List<Repair>>(repairList, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Repair> getRepair(@PathVariable Long id, Principal principal) {
        final User currentUser = userService.getUserByUsername(principal.getName());
        Repair repair = repairService.getRepairByUser(id, currentUser);
        if (repair == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return new ResponseEntity<Repair>(repair, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Repair> deleteRepair(@PathVariable Long id) {
        Repair repair = repairService.deleteRepair(id);
        if (repair == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return new ResponseEntity<Repair>(repair, HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Repair> updateRepair(@PathVariable Long id, @RequestBody RepairEntity repairEntity, Principal principal) {
        final User currentUser = userService.getUserByUsername(principal.getName());
        Repair repair = null;
        try {
            repair = repairService.updateRepairByUser(id, repairEntity, currentUser);
        } catch (TimeOverlapException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        if (repair == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return new ResponseEntity<Repair>(repair, HttpStatus.OK);
    }

    @RequestMapping(value = "/filter", method = RequestMethod.POST)
    public ResponseEntity<List<Repair>> searchRepair(@RequestBody FilterRepairEntity filterRepairEntity, Principal principal) {
        final User currentUser = userService.getUserByUsername(principal.getName());
        List<Repair> repairs = repairService.filterRepairByUser(filterRepairEntity, currentUser);
        return new ResponseEntity<List<Repair>>(repairs, HttpStatus.OK);
    }

}
