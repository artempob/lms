package com.example.lms.billing.internal;


import com.example.lms.courses.CoursePublishedEvent;
import com.example.lms.users.UserCreatedEvent;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;
import org.jooq.DSLContext;
import java.math.BigDecimal;
import java.util.UUID;
import static com.example.lms.jooq.Tables.WALLETS;
import static com.example.lms.jooq.Tables.BILLING_PRODUCTS;

@Component
public class BillingEventListener {

    private final DSLContext dsl;

    public BillingEventListener(DSLContext dsl) {
        this.dsl = dsl;
    }

    @ApplicationModuleListener
    void onUserCreated(UserCreatedEvent event) {
        dsl.insertInto(WALLETS)
                .set(WALLETS.ID, UUID.randomUUID())
                .set(WALLETS.USER_ID, event.userId())
                .set(WALLETS.BALANCE, BigDecimal.ZERO)
                .onConflict(WALLETS.USER_ID).doNothing().execute();
    }

    @ApplicationModuleListener
    void onCoursePublished(CoursePublishedEvent event) {
        dsl.insertInto(BILLING_PRODUCTS)
                .set(BILLING_PRODUCTS.COURSE_ID, event.courseId())
                .set(BILLING_PRODUCTS.PRICE, event.price())
                .onConflict(BILLING_PRODUCTS.COURSE_ID).doUpdate()
                .set(BILLING_PRODUCTS.PRICE, event.price()).execute();
    }
}
