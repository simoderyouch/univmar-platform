package com.univmar.rfq;

import static org.assertj.core.api.Assertions.assertThat;

import com.univmar.catalog.CatalogService;
import com.univmar.catalog.api.CatalogDtos.MaterialDetail;
import com.univmar.catalog.api.CatalogDtos.MaterialInput;
import com.univmar.catalog.api.CatalogDtos.VariantInput;
import com.univmar.catalog.api.CatalogDtos.VariantResponse;
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
import com.univmar.quotation.QuotationService;
import com.univmar.quotation.api.QuotationDtos.Input;
import com.univmar.quotation.api.QuotationDtos.Item;
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
    @Autowired private QuotationService quotations;

    @Test
    void creates_a_draft_and_submits_without_reserving_stock() {
        CustomerResponse customer = customers.create(new CustomerInput(CustomerType.COMPANY, "Atlas Construction", null, null, null, null, List.of(), List.of()));
        ProjectResponse project = projects.create(new ProjectInput(customer.id(), "Marrakech Hotel", null, "Hotel", null, null, null, LocalDate.of(2026, 12, 15), "Sara", ProjectStatus.LEAD, null));
        MaterialDetail material = catalog.create(new MaterialInput("Atlas Ivory", null, "RFQ-ATLAS-IVORY", StoneType.MARBLE, "Morocco", "Ivory", null, null, null, null, List.of()));
        VariantResponse variant = catalog.createVariant(material.id(), new VariantInput(new BigDecimal("20.000"), "Honed", "Slab"));

        RfqResponse draft = rfqs.create(new RfqInput(customer.id(), project.id(), LocalDate.of(2026, 12, 15), "Marrakech", "Lobby package", List.of()));
        assertThat(draft.status()).isEqualTo(RfqStatus.DRAFT);

        RfqResponse withItem = rfqs.addItem(draft.id(), new RfqItemInput(material.id(), variant.id(), new BigDecimal("120.000"), "m²", "120 × 60 cm", null, null));
        RfqResponse submitted = rfqs.submit(withItem.id());

        assertThat(submitted.status()).isEqualTo(RfqStatus.SUBMITTED);
        assertThat(submitted.items()).singleElement().satisfies(item -> {
            assertThat(item.quantityM2()).isEqualByComparingTo("120.000");
            assertThat(item.availableM2()).isEqualByComparingTo("0");
        });
        RfqResponse underReview = rfqs.startReview(submitted.id());
        assertThat(underReview.status()).isEqualTo(RfqStatus.UNDER_REVIEW);

        var quote = quotations.create(new Input(customer.id(), project.id(), underReview.id(), LocalDate.now().plusDays(7), BigDecimal.ZERO, null, null, List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("120.000"), new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("20")))));
        assertThat(quote.status()).isEqualTo(com.univmar.quotation.domain.QuotationStatus.DRAFT);
        assertThat(rfqs.detail(underReview.id()).status()).isEqualTo(RfqStatus.UNDER_REVIEW);

        var edited = quotations.update(quote.id(), new Input(customer.id(), project.id(), underReview.id(), LocalDate.now().plusDays(14), new BigDecimal("250"), "30 days", "Repriced after supplier confirmation", List.of(new Item(variant.id(), material.name(), "20 mm · Honed", new BigDecimal("90.000"), new BigDecimal("650"), new BigDecimal("10"), new BigDecimal("10")))));
        assertThat(edited.transport()).isEqualByComparingTo("250.00");
        assertThat(edited.grandTotal()).isEqualByComparingTo("58165.00");
        assertThat(edited.items()).singleElement().satisfies(item -> {
            assertThat(item.quantityM2()).isEqualByComparingTo("90.000");
            assertThat(item.unitPrice()).isEqualByComparingTo("650.00");
            assertThat(item.discountPercent()).isEqualByComparingTo("10.00");
            assertThat(item.taxPercent()).isEqualByComparingTo("10.00");
        });

        assertThat(quotations.send(edited.id()).status()).isEqualTo(com.univmar.quotation.domain.QuotationStatus.SENT);
        assertThat(rfqs.detail(underReview.id()).status()).isEqualTo(RfqStatus.QUOTED);
    }
}
