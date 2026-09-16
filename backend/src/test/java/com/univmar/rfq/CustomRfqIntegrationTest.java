package com.univmar.rfq;

import com.univmar.rfq.api.RfqDtos;
import com.univmar.rfq.domain.QuoteRequestItemRepository;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class CustomRfqIntegrationTest {
    @Autowired private RfqService service;
    @Autowired private UserRepository users;
    @Autowired private QuoteRequestRepository requests;
    @Autowired private QuoteRequestItemRepository items;

    @Test
    void customerCanSubmitDescribedItemWithoutACatalogueVariant() {
        User customer = users.save(new User("custom-rfq-" + UUID.randomUUID() + "@example.com", "hash", Role.CUSTOMER));
        var created = service.create(customer.getId(), new RfqDtos.Create(
                List.of(new RfqDtos.Item(null, "Custom-cut Verde Guatemala for a curved reception desk", new BigDecimal("12.50"), "Plans attached")),
                null, "Please advise on availability", LocalDate.now().plusDays(21)));

        var submitted = service.submit(customer.getId(), created.id());
        var line = items.findByRequestId(created.id()).get(0);

        assertThat(submitted.status()).isEqualTo("SUBMITTED");
        assertThat(requests.findById(created.id()).orElseThrow().getSubmittedAt()).isNotNull();
        assertThat(line.getVariant()).isNull();
        assertThat(line.getDescription()).contains("Verde Guatemala");
    }
}
