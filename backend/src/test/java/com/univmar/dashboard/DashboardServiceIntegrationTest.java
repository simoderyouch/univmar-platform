package com.univmar.dashboard;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class DashboardServiceIntegrationTest {
    @Autowired private DashboardService dashboard;
    @Test void returns_a_consistent_snapshot_from_current_operations() { var overview = dashboard.overview(); assertThat(overview.orderCount()).isGreaterThanOrEqualTo(0); assertThat(overview.salesValue()).isGreaterThanOrEqualTo(java.math.BigDecimal.ZERO); assertThat(overview.availableM2()).isGreaterThanOrEqualTo(java.math.BigDecimal.ZERO); assertThat(overview.quotations()).isNotNull(); assertThat(overview.fulfillment()).isNotNull(); }
}
