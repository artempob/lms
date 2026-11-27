package com.example.lms.billing.internal;

import com.example.lms.billing.internal.dto.WalletResponse;
import com.example.lms.common.JwtPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/billing/wallets")
public class WalletController {

    private final WalletQueryService walletQueryService;

    public WalletController(WalletQueryService walletQueryService) {
        this.walletQueryService = walletQueryService;
    }

    @GetMapping("/me")
    public WalletResponse getMyWallet(
            @AuthenticationPrincipal JwtPrincipal principal
    ) {
        return walletQueryService.getWallet(principal.id());
    }
}