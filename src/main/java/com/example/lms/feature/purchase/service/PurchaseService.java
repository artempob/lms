package com.example.lms.feature.purchase.service;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static com.example.lms.jooq.tables.Transactions.TRANSACTIONS;
import static com.example.lms.jooq.tables.Enrollments.ENROLLMENTS;
import static com.example.lms.jooq.tables.Courses.COURSES;
import static com.example.lms.jooq.tables.Wallets.WALLETS;
import com.example.lms.common.ConflictException;
import com.example.lms.common.NotFoundException;
import com.example.lms.courses.CourseStatus;
import java.time.OffsetDateTime;


@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final DSLContext dsl;

    @Transactional
    public void purchaseCourseAtomic(UUID userId, UUID courseId) {



        var courseRecord = dsl
                .select(COURSES.PRICE, COURSES.STATUS, COURSES.AUTHOR_ID)
                .from(COURSES)
                .where(COURSES.ID.eq(courseId))
                .fetchOne();

        if (courseRecord == null) {
            throw new NotFoundException(
                    "Курс не найден"
            );
        }



        if (!CourseStatus.PUBLISHED.name().equals(
                courseRecord.get(COURSES.STATUS)
        )) {
            throw new ConflictException(
                    "Курс недоступен для приобретения"
            );
        }

        BigDecimal coursePrice = courseRecord.get(COURSES.PRICE);

        if (userId.equals(courseRecord.get(COURSES.AUTHOR_ID))) {
            throw new ConflictException("Автору не требуется покупать собственный курс");
        }

        var walletRecord = dsl
                .select(WALLETS.ID, WALLETS.BALANCE)
                .from(WALLETS)
                .where(WALLETS.USER_ID.eq(userId))
                .forUpdate()
                .fetchOne();

        if (walletRecord == null) {
            throw new NotFoundException(
                    "Кошелек не найден"
            );
        }

        boolean isAlreadyPurchased = dsl.fetchExists(
                dsl.selectFrom(ENROLLMENTS)
                        .where(ENROLLMENTS.STUDENT_ID.eq(userId))
                        .and(ENROLLMENTS.COURSE_ID.eq(courseId))
        );

        if (isAlreadyPurchased) {
            throw new ConflictException(
                    "Курс уже приобретен"
            );
        }

        UUID walletId = walletRecord.get(WALLETS.ID);
        BigDecimal currentBalance = walletRecord.get(WALLETS.BALANCE);

        if (currentBalance.compareTo(coursePrice) < 0) {
            throw new ConflictException(
                    "Недостаточно средств на балансе"
            );
        }

        dsl.update(WALLETS)
                .set(WALLETS.BALANCE, WALLETS.BALANCE.minus(coursePrice))
                .set(WALLETS.UPDATED_AT, OffsetDateTime.now())
                .where(WALLETS.USER_ID.eq(userId))
                .execute();

        if (coursePrice.signum() > 0) {
            dsl.insertInto(TRANSACTIONS)
                    .set(TRANSACTIONS.ID, UUID.randomUUID())
                    .set(TRANSACTIONS.WALLET_ID, walletId)
                    .set(TRANSACTIONS.AMOUNT, coursePrice)
                    .set(TRANSACTIONS.TYPE, "WITHDRAWAL")
                    .set(
                            TRANSACTIONS.DESCRIPTION,
                            "Покупка курса " + courseId
                    )
                    .execute();
        }
        dsl.insertInto(ENROLLMENTS)
                .set(ENROLLMENTS.ID, UUID.randomUUID())  
                .set(ENROLLMENTS.STUDENT_ID, userId)
                .set(ENROLLMENTS.COURSE_ID, courseId)
                .set(ENROLLMENTS.STATUS, "ACTIVE")
                .execute();

    }
}
