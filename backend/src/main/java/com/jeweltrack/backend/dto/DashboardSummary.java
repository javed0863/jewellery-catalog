package com.jeweltrack.backend.dto;

import java.math.BigDecimal;

public class DashboardSummary {

    private BigDecimal totalGoldGrams;
    private BigDecimal totalGoldValue;
    private BigDecimal totalSilverGrams;
    private BigDecimal totalSilverValue;
    private BigDecimal totalOtherGrams;
    private BigDecimal totalOtherValue;
    private Integer totalItems;
    private BigDecimal totalAmountSpent;

    public BigDecimal getTotalGoldGrams() {
        return totalGoldGrams;
    }

    public void setTotalGoldGrams(BigDecimal totalGoldGrams) {
        this.totalGoldGrams = totalGoldGrams;
    }

    public BigDecimal getTotalGoldValue() {
        return totalGoldValue;
    }

    public void setTotalGoldValue(BigDecimal totalGoldValue) {
        this.totalGoldValue = totalGoldValue;
    }

    public BigDecimal getTotalSilverGrams() {
        return totalSilverGrams;
    }

    public void setTotalSilverGrams(BigDecimal totalSilverGrams) {
        this.totalSilverGrams = totalSilverGrams;
    }

    public BigDecimal getTotalSilverValue() {
        return totalSilverValue;
    }

    public void setTotalSilverValue(BigDecimal totalSilverValue) {
        this.totalSilverValue = totalSilverValue;
    }

    public BigDecimal getTotalOtherGrams() {
        return totalOtherGrams;
    }

    public void setTotalOtherGrams(BigDecimal totalOtherGrams) {
        this.totalOtherGrams = totalOtherGrams;
    }

    public BigDecimal getTotalOtherValue() {
        return totalOtherValue;
    }

    public void setTotalOtherValue(BigDecimal totalOtherValue) {
        this.totalOtherValue = totalOtherValue;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalAmountSpent() {
        return totalAmountSpent;
    }

    public void setTotalAmountSpent(BigDecimal totalAmountSpent) {
        this.totalAmountSpent = totalAmountSpent;
    }
}
