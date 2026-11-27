package com.example.lms.feature.purchase.api;

import com.example.lms.feature.purchase.dto.PurchaseRequest;
import com.example.lms.feature.purchase.service.PurchaseService;
import com.example.lms.common.JwtPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Void> purchaseCourse(
            @Valid @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal JwtPrincipal  principal
    ) {
        purchaseService.purchaseCourseAtomic(
                principal.id(),
                request.getCourseId()
        );

        return ResponseEntity.ok().build();
    }
}