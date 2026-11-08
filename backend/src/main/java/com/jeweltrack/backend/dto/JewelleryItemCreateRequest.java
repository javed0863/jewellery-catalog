package com.jeweltrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class JewelleryItemCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String name;

    @NotBlank
    private String type;

    private BigDecimal carat;

    @NotNull
    @Positive
    private BigDecimal weightGrams;

    @NotNull
    @Positive
    private BigDecimal amountSpent;

    @Size(max = 1000)
    private String remarks;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getCarat() {
        return carat;
    }

    public void setCarat(BigDecimal carat) {
        this.carat = carat;
    }

    public BigDecimal getWeightGrams() {
        return weightGrams;
    }

    public void setWeightGrams(BigDecimal weightGrams) {
        this.weightGrams = weightGrams;
    }

    public BigDecimal getAmountSpent() {
        return amountSpent;
    }

    public void setAmountSpent(BigDecimal amountSpent) {
        this.amountSpent = amountSpent;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
