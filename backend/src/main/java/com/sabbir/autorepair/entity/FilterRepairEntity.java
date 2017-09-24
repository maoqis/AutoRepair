package com.sabbir.autorepair.entity;

import com.sabbir.autorepair.model.Repair;

public class FilterRepairEntity {
    private String date;
    private String time;
    private Long assignedUserId;
    private Repair.Status status;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public Repair.Status getStatus() {
        return status;
    }

    public void setStatus(Repair.Status status) {
        this.status = status;
    }
}
