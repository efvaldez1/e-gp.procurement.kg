package com.example.eprocurement;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tenders")
public class Tender {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String procurementNumber;
    private String subjectOfProcurement;
    private String procuringEntity;
    private String status;
    private Date tenderDeadline;
    private double budgetAmount;

    // Default constructor for JPA
    public Tender() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProcurementNumber() {
        return procurementNumber;
    }

    public void setProcurementNumber(String procurementNumber) {
        this.procurementNumber = procurementNumber;
    }

    public String getSubjectOfProcurement() {
        return subjectOfProcurement;
    }

    public void setSubjectOfProcurement(String subjectOfProcurement) {
        this.subjectOfProcurement = subjectOfProcurement;
    }

    public String getProcuringEntity() {
        return procuringEntity;
    }

    public void setProcuringEntity(String procuringEntity) {
        this.procuringEntity = procuringEntity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getTenderDeadline() {
        return tenderDeadline;
    }

    public void setTenderDeadline(Date tenderDeadline) {
        this.tenderDeadline = tenderDeadline;
    }

    public double getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }
}