package com.sabbir.autorepair.service;

import com.sabbir.autorepair.entity.RepairEntity;
import com.sabbir.autorepair.exception.TimeOverlapException;
import com.sabbir.autorepair.exception.UserNotFoundException;
import com.sabbir.autorepair.model.Repair;
import com.sabbir.autorepair.model.User;
import com.sabbir.autorepair.model.repository.RepairRepository;
import com.sabbir.autorepair.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

@Service
public class RepairService {
    private static final Logger logger = Logger.getLogger(RepairService.class.getName());
    private static final long overlapInMS = ((59 * 60) + 59) * 1000; //59min * 60s + 59s
    @Autowired
    private RepairRepository repairRepository;
    @Autowired
    private UserRepository userRepository;
    private DateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    public Repair createRepair(RepairEntity repairEntity) throws TimeOverlapException, UserNotFoundException {
        final Repair repair = new Repair();
        repair.setRepairName(repairEntity.getRepairName());
        repair.setDescription(repairEntity.getDescription());
        try {
            if (repairEntity.getDateTime() != null) {
                final Date date = dateTimeFormat.parse(repairEntity.getDateTime());
                if (checkDate(date, null)) {
                    repair.setDateTime(date);
                } else {
                    throw new TimeOverlapException("Time overlapped");
                }
            }

        } catch (ParseException e) {
            repair.setDateTime(null);
        }

        if (repairEntity.getStatus() != null) {
            repair.setStatus(repairEntity.getStatus());
        }
        if (repairEntity.getAssignedUserId() != null) {
            final User user = userRepository.findById(repairEntity.getAssignedUserId());
            if (user == null || !user.getRole().equals("user")) {
                throw new UserNotFoundException();
            }
            repair.setAssignedUserId(repairEntity.getAssignedUserId());
        }
        logger.info(repair.toString());
        Repair savedRepair = repairRepository.save(repair);
        savedRepair = repairRepository.findOne(savedRepair.getId());
        return savedRepair;
    }

    private boolean checkDate(Date date, Long id) {
        final Date fromTime = new Date(date.getTime() - overlapInMS);
        final Date untilTime = new Date(date.getTime() + overlapInMS);
        List<Repair> overlappingRepairs = repairRepository.findByDateTimeBetween(fromTime, untilTime);
        if (overlappingRepairs.isEmpty()) {
            return true;
        } else {
            if (id != null) {
                if (overlappingRepairs.size() == 1 && overlappingRepairs.get(0).getId() == id) {
                    return true;
                }
            }
            return false;
        }
    }

    public List<Repair> getAllRepairsByUser(User user) {
        if (user.getRole().equals("manager")) {
            return repairRepository.findAll();
        } else {
            return getAllRepairsOfUser(user);
        }
    }

    public List<Repair> getAllRepairsOfUser(User user) {
        final Long userId = user.getId();
        return repairRepository.findByAssignedUserId(userId);
    }

    public Repair getRepairByUser(Long repairId, User user) {
        Repair repair = repairRepository.findOne(repairId);
        if (repair != null) {
            if (user.getRole().equals("manager"))
                return repair;
            else if ((repair.getAssignedUserId() != null) && (repair.getAssignedUserId() == user.getId())) {
                return repair;
            }
        }
        return null;
    }

    public Repair deleteRepair(Long repairId) {
        final Repair repair = repairRepository.findOne(repairId);
        try {
            repairRepository.delete(repairId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
        repair.setId(null);
        return repair;
    }

    public Repair updateRepairByUser(Long repairId, RepairEntity repairEntity, User user) throws TimeOverlapException {
        if (repairEntity.getId() == null || repairEntity.getId() != repairId)
            return null;
        final Repair repair = repairRepository.findOne(repairId);
        if (repair == null) return null;
        if (!user.getRole().equals("manager") &&
                (repair.getAssignedUserId() == null || user.getId() != repair.getAssignedUserId())) {
            return null;
        }
        if (repairEntity.getStatus() != null && repairEntity.getStatus() != repair.getStatus()) {
            if (user.getRole().equals("manager") || repairEntity.getStatus() == Repair.Status.APPROVE)
                repair.setStatus(repairEntity.getStatus());
        }
        if (user.getRole().equals("manager")) {
            if (repairEntity.getRepairName() != null && !repairEntity.getRepairName().equals(repair.getRepairName())) {
                repair.setRepairName(repairEntity.getRepairName());
            }
            if (repairEntity.getDescription() != null) {
                repair.setDescription(repairEntity.getDescription());
            }
            if (repairEntity.getAssignedUserId() != null || repair.getAssignedUserId() != repairEntity.getAssignedUserId()) {
                repair.setAssignedUserId(repairEntity.getAssignedUserId());
            }

            if (repairEntity.getDateTime() != null) {
                try {
                    final Date date = dateTimeFormat.parse(repairEntity.getDateTime());
                    if (checkDate(date, repair.getId())) {
                        repair.setDateTime(date);
                    } else {
                        throw new TimeOverlapException("Time overlapped");
                    }
                } catch (ParseException ex) {

                }
            }
        }
        final Repair saveRepair = repairRepository.save(repair);
        return saveRepair;
    }
}
