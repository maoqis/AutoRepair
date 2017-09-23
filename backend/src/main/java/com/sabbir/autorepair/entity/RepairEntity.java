package com.sabbir.autorepair.entity;

import com.sabbir.autorepair.model.Repair;

public class RepairEntity {
    private Long id;
    private String repairName;
    private String description;
    private String dateTime;
    private Repair.Status status;
    private Long assignedUserId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRepairName() {
        return repairName;
    }

    public void setRepairName(String repairName) {
        this.repairName = repairName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public Repair.Status getStatus() {
        return status;
    }

    public void setStatus(Repair.Status status) {
        this.status = status;
    }


    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    @Override
    public String toString() {
        return "[ id: " + this.id
                + ", repairName: " + this.repairName
                + ", descriptin: " + this.description
                + ", dateTime: " + this.dateTime
                + ", status: " + this.status
                + ", assignedUserId: " + this.assignedUserId + " ]";
    }
}
