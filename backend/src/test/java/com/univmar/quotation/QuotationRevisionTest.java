package com.univmar.quotation;

import com.univmar.quotation.domain.Quotation;
import com.univmar.quotation.domain.QuotationStatus;
import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class QuotationRevisionTest {
    @Test
    void revisingASentQuotationMakesTheOriginalSuperseded() {
        QuoteRequest request = new QuoteRequest(new User("customer@example.com", "hash", Role.CUSTOMER), "Revision", LocalDate.now().plusDays(7));
        request.submit();
        request.review(1L);
        Quotation quotation = new Quotation(request, "QUO-REVISION", LocalDate.now().plusDays(7), BigDecimal.TEN, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.TEN);
        quotation.send();

        quotation.supersede();

        assertThat(quotation.getStatus()).isEqualTo(QuotationStatus.SUPERSEDED);
    }
}
