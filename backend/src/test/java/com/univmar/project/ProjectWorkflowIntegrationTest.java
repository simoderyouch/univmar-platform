package com.univmar.project;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.CustomerInput;
import com.univmar.customer.api.CustomerDtos.CustomerResponse;
import com.univmar.customer.domain.CustomerType;
import com.univmar.project.api.ProjectDtos.ProjectInput;
import com.univmar.project.api.ProjectDtos.ProjectResponse;
import com.univmar.project.domain.ProjectStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ProjectWorkflowIntegrationTest {
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;

    @Test
    void creates_updates_and_filters_a_customer_project() {
        CustomerResponse customer = customers.create(new CustomerInput(
                CustomerType.COMPANY, "Atlas Construction", "Atlas Construction SARL",
                "projects@atlas.example", null, null, List.of(), List.of()));

        ProjectResponse created = projects.create(new ProjectInput(
                customer.id(), "Marrakech Hotel", "Marrakech", "Hotel", "Lobby stone package",
                new BigDecimal("250000.00"), LocalDate.of(2026, 10, 1), LocalDate.of(2026, 12, 15),
                "Sara", ProjectStatus.LEAD, "Priority commercial opportunity"));

        assertThat(created.customerId()).isEqualTo(customer.id());
        assertThat(created.status()).isEqualTo(ProjectStatus.LEAD);

        ProjectResponse updated = projects.update(created.id(), new ProjectInput(
                customer.id(), "Marrakech Hotel", "Marrakech", "Hotel", "Lobby stone package",
                new BigDecimal("275000.00"), LocalDate.of(2026, 10, 1), LocalDate.of(2026, 12, 15),
                "Sara", ProjectStatus.ACTIVE, "Confirmed for quotation"));

        assertThat(updated.status()).isEqualTo(ProjectStatus.ACTIVE);
        assertThat(projects.list("hotel", customer.id(), ProjectStatus.ACTIVE, PageRequest.of(0, 20)).content())
                .extracting(ProjectResponse::id).contains(updated.id());
    }
}
