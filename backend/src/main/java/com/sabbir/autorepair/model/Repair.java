package com.sabbir.autorepair.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Repair")
public class Repair {
    @Id
    @GeneratedValue
    private Long id;

    private String repairName;

    private String description;

    @Column(name = "date", columnDefinition = "DATE")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name = "time", columnDefinition = "TIME")
    @Temporal(TemporalType.TIME)
    private Date time;

    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
