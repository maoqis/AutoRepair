package com.sabbir.autorepair.Config;

import com.sabbir.autorepair.entity.RepairEntity;
import com.sabbir.autorepair.entity.UserWithPassword;
import com.sabbir.autorepair.model.Repair;
import com.sabbir.autorepair.service.RepairService;
import com.sabbir.autorepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class ApplicationStartLoader implements CommandLineRunner {
    private static Logger logger = Logger.getLogger(CommandLineRunner.class.getName());
    @Autowired
    UserService userService;

    @Autowired
    RepairService repairService;

    @Override
    public void run(String... args) {
        final UserWithPassword manager = new UserWithPassword();
        manager.setUsername("sabbir");
        manager.setPassword("ahmed");
        if (userService.getUserByUsername("sabbir") == null)
            userService.createManager(manager);

        final UserWithPassword user = new UserWithPassword();
        user.setUsername("user1");
        user.setPassword("123456");
        if (userService.getUserByUsername("user1") == null)
            userService.createUser(user);

        RepairEntity repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-23 17:00");
        repairEntity.setRepairName("repair x");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
        } catch (Exception ex) {

        }

        repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-23 18:00");
        repairEntity.setRepairName("repair y");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
        } catch (Exception ex) {

        }

        repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-24 17:00");
        repairEntity.setRepairName("repair z");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
        } catch (Exception ex) {

        }

    }
}
