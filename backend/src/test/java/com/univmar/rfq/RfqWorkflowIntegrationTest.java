package com.univmar.rfq;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
import com.univmar.catalog.domain.Finish;
import com.univmar.catalog.domain.StoneType;
import com.univmar.customer.CustomerService;
import com.univmar.customer.api.CustomerDtos.CustomerInput;
import com.univmar.customer.api.CustomerDtos.CustomerResponse;
import com.univmar.customer.domain.CustomerType;
import com.univmar.project.ProjectService;
import com.univmar.project.api.ProjectDtos.ProjectInput;
import com.univmar.project.api.ProjectDtos.ProjectResponse;
import com.univmar.project.domain.ProjectStatus;
import com.univmar.rfq.api.RfqDtos.RfqInput;
import com.univmar.rfq.api.RfqDtos.RfqItemInput;
import com.univmar.rfq.api.RfqDtos.RfqResponse;
import com.univmar.rfq.domain.RfqStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class RfqWorkflowIntegrationTest {
    @Autowired private CustomerService customers;
    @Autowired private ProjectService projects;
    @Autowired private CatalogService catalog;
    @Autowired private RfqService rfqs;

    @Test
    void creates_a_draft_and_submits_without_reserving_stock() {
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Atlas Construction", null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Marrakech Hotel", null, "Hotel", null, null, null, LocalDate.of(2026, 12, 15), "Sara", ProjectStatus.LEAD, null));
        MaterialDetail material = catalog.create(new MaterialInput("Atlas Ivory", null, "RFQ-ATLAS-IVORY", StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), Finish.HONED, "Slab"));

        RfqResponse draft = rfqs.create(new RfqInput(customer.id(), project.id(), LocalDate.of(2026, 12, 15), "Marrakech", "Lobby package", List.of()));
        assertThat(draft.status()).isEqualTo(RfqStatus.DRAFT);

        RfqResponse withItem = rfqs.addItem(draft.id(), new RfqItemInput(material.id(), variant.id(), new BigDecimal("120.000"), "m²", "120 × 60 cm", null, null));
        RfqResponse submitted = rfqs.submit(withItem.id());

        assertThat(submitted.status()).isEqualTo(RfqStatus.SUBMITTED);
        assertThat(submitted.items()).singleElement().satisfies(item -> {
            assertThat(item.quantityM2()).isEqualByComparingTo("120.000");
            assertThat(item.availableM2()).isEqualByComparingTo("0");
        });
        assertThat(rfqs.startReview(submitted.id()).status()).isEqualTo(RfqStatus.UNDER_REVIEW);
    }
}
