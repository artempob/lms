package com.example.lms.billing.internal;

import com.example.lms.billing.internal.dto.WalletResponse;
import com.example.lms.common.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class WalletQueryService {

    private final WalletRepository walletRepository;

    public WalletQueryService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @Transactional(readOnly = true)
    public WalletResponse getWallet(UUID userId) {
        WalletEntity wallet = walletRepository
                .findByUserId(userId)
                .orElseThrow(() -> new NotFoundException(
                        "Кошелек не найден"
                ));

        return new WalletResponse(
                wallet.getId(),
                wallet.getUserId(),
                wallet.getBalance()
        );
    }
}