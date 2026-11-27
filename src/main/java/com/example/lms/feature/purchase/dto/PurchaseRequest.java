package com.example.lms.feature.purchase.dto;

import java.util.UUID;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class PurchaseRequest {

    @NotNull(message = "Укажи идентификатор курса")
    private UUID courseId;
}