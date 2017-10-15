package com.sabbir.autorepair.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.sabbir.autorepair.Util.CustomDateSerializer;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Repair")
public class Repair {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String repairName;

    private String description;

    @Column(name = "datetime", columnDefinition = "DATETIME", nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = CustomDateSerializer.class)
    private Date dateTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status = Status.INCOMPLETE;

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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Long getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Long assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
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

    public static enum Status {
        @JsonProperty("complete")
        COMPLETE,
        @JsonProperty("incomplete")
        INCOMPLETE,
        @JsonProperty("approve")
        APPROVE
    }
}
