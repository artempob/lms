package com.example.lms;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;
import com.tngtech.archunit.core.domain.JavaClass;

class ModulithTest {

    ApplicationModules modules = ApplicationModules.of(LmsApplication.class,
            JavaClass.Predicates.resideInAPackage("com.example.lms.jooq.."));

    @Test
    void verifyModuleStructure() {
        modules.verify();
    }

    @Test
    void createModuleDocumentation() {
        new Documenter(modules).writeDocumentation();
    }
}
