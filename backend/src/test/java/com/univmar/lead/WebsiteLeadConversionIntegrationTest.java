package com.univmar.lead;

import com.univmar.catalog.domain.StoneMaterial;
import com.univmar.catalog.domain.StoneMaterialRepository;
import com.univmar.catalog.domain.StoneVariant;
import com.univmar.catalog.domain.StoneVariantRepository;
import com.univmar.customer.domain.CustomerProfileRepository;
import com.univmar.lead.api.WebsiteLeadDtos;
import com.univmar.lead.domain.WebsiteLeadStatus;
import com.univmar.lead.domain.WebsiteQuoteRequestRepository;
import com.univmar.rfq.domain.QuoteRequestItemRepository;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.user.domain.AccountStatus;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class WebsiteLeadConversionIntegrationTest {
    @Autowired private WebsiteLeadService service;
    @Autowired private WebsiteQuoteRequestRepository leads;
    @Autowired private UserRepository users;
    @Autowired private CustomerProfileRepository profiles;
    @Autowired private QuoteRequestRepository rfqs;
    @Autowired private QuoteRequestItemRepository rfqItems;
    @Autowired private StoneMaterialRepository materials;
    @Autowired private StoneVariantRepository variants;

    @Test
    void qualifiedLeadConvertsIntoPendingCustomerAndDraftRfq() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        StoneMaterial material = materials.save(new StoneMaterial("Lead Stone " + suffix, "lead-stone-" + suffix,
                "Marble", "Morocco", "Beige", "Conversion test", "Walls"));
        variants.save(new StoneVariant(material, "Polished", new BigDecimal("20.00"), "A", new BigDecimal("600.00")));
        User sales = users.save(new User("sales-" + suffix + "@example.com", "hash", Role.SALES));

        var received = service.receive(new WebsiteLeadDtos.CreateRequest("Sara El Mansouri", "sara-" + suffix + "@example.com",
                "+212600000000", "Atelier Sara", "Kitchen and worktop", "Rabat", material.getName(), material.getSlug(),
                new BigDecimal("18.50"), "Plans are ready", LocalDate.now().plusDays(14), "fr", ""));
        var lead = leads.findAll().stream().filter(item -> item.getReferenceNumber().equals(received.referenceNumber())).findFirst().orElseThrow();

        service.changeStatus(lead.getId(), WebsiteLeadStatus.CONTACTED, sales.getId());
        service.changeStatus(lead.getId(), WebsiteLeadStatus.QUALIFIED, sales.getId());
        var converted = service.convert(lead.getId(), sales.getId());

        assertThat(converted.status()).isEqualTo(WebsiteLeadStatus.CONVERTED);
        assertThat(converted.convertedCustomerId()).isNotNull();
        assertThat(converted.convertedRfqId()).isNotNull();
        assertThat(users.findByEmailIgnoreCase("sara-" + suffix + "@example.com").orElseThrow().getStatus())
                .isEqualTo(AccountStatus.PENDING);
        assertThat(profiles.findById(converted.convertedCustomerId())).isPresent();
        assertThat(rfqs.findById(converted.convertedRfqId())).isPresent();
        assertThat(rfqItems.findByRequestId(converted.convertedRfqId())).hasSize(1);
    }
}
