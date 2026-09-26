package com.univmar.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.univmar.audit.domain.AuditEventRepository;
import com.univmar.common.storage.ImageStorage;
import com.univmar.user.domain.Role;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

@SpringBootTest
@AutoConfigureMockMvc
class RoleAuthorizationIntegrationTest {
    @Autowired private MockMvc mvc;
    @Autowired private AuditEventRepository auditEvents;
    @Autowired private ImageStorage images;

    /**
     * Covers every staff role against each role-protected route family. A
     * successful authorization may still fail validation because the test uses
     * intentionally minimal request bodies; it must never be rejected as 401/403.
     */
    @ParameterizedTest(name = "{0} on {1}")
    @MethodSource("roleRouteMatrix")
    void everyRoleIsAllowedOnlyOnItsCriticalRouteFamilies(Role role, CriticalRoute route) throws Exception {
        String actor = role.name().toLowerCase() + "@security.test";
        int responseStatus = mvc.perform(request(route.method(), route.path())
                .with(user(actor).roles(role.name()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andReturn().getResponse().getStatus();

        if (route.allowedRoles().contains(role)) {
            assertThat(responseStatus)
                .as("authorized %s must pass the security layer for %s", role, route.path())
                .isNotIn(401, 403);
            return;
        }

        assertThat(responseStatus).isEqualTo(403);
        assertThat(auditEvents.findTop100ByTargetTypeAndEventTypeOrderByOccurredAtDesc(
                com.univmar.document.domain.DocumentTargetType.SECURITY, "ACCESS_DENIED"))
            .anySatisfy(event -> {
                assertThat(event.getActor()).isEqualTo(actor);
                assertThat(event.getMessage()).isEqualTo("Denied " + route.method() + " " + route.path());
            });
    }

    private static Stream<Arguments> roleRouteMatrix() {
        Set<Role> allStaff = EnumSet.allOf(Role.class);
        return Stream.of(
                route(HttpMethod.POST, "/api/v1/users", Role.ADMIN),
                route(HttpMethod.PUT, "/api/v1/cms/contact-form", Role.ADMIN, Role.MANAGER),
                route(HttpMethod.POST, "/api/v1/invoices/00000000-0000-0000-0000-000000000001/payments", Role.ADMIN, Role.MANAGER),
                route(HttpMethod.POST, "/api/v1/suppliers", Role.ADMIN, Role.MANAGER, Role.PURCHASING_MANAGER),
                route(HttpMethod.POST, "/api/v1/inventory/receipts", Role.ADMIN, Role.MANAGER, Role.INVENTORY_MANAGER),
                route(HttpMethod.POST, "/api/v1/deliveries", Role.ADMIN, Role.MANAGER, Role.INVENTORY_MANAGER),
                route(HttpMethod.POST, "/api/v1/customers", Role.ADMIN, Role.MANAGER, Role.SALES_AGENT),
                route(HttpMethod.POST, "/api/v1/materials", Role.ADMIN, Role.MANAGER),
                new CriticalRoute(HttpMethod.POST, "/api/v1/uploads/images", allStaff),
                new CriticalRoute(HttpMethod.GET, "/api/v1/uploads/documents/00000000-0000-0000-0000-000000000001.pdf", allStaff)
            )
            .flatMap(route -> Arrays.stream(Role.values()).map(role -> Arguments.of(role, route)));
    }

    private static CriticalRoute route(HttpMethod method, String path, Role... allowedRoles) {
        return new CriticalRoute(method, path, EnumSet.copyOf(Arrays.asList(allowedRoles)));
    }

    private record CriticalRoute(HttpMethod method, String path, Set<Role> allowedRoles) {
        @Override public String toString() { return method + " " + path; }
    }

    @Test
    @WithMockUser(username = "sales@example.test", roles = "SALES_AGENT")
    void salesCanReadCatalogButCannotAdjustInventory() throws Exception {
        mvc.perform(get("/api/v1/materials"))
            .andExpect(status().isOk());

        mvc.perform(post("/api/v1/inventory/receipts").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    @WithMockUser(username = "inventory@example.test", roles = "INVENTORY_MANAGER")
    void inventoryManagerCannotEditCustomers() throws Exception {
        mvc.perform(post("/api/v1/customers").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "purchasing@example.test", roles = "PURCHASING_MANAGER")
    void purchasingManagerCannotRecordPayments() throws Exception {
        mvc.perform(post("/api/v1/invoices/00000000-0000-0000-0000-000000000001/payments").contentType(MediaType.APPLICATION_JSON).content("{}"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sales@example.test", roles = "SALES_AGENT")
    void salesAgentCannotOpenUserAdministration() throws Exception {
        mvc.perform(get("/api/v1/users"))
            .andExpect(status().isForbidden());

        mvc.perform(patch("/api/v1/users/00000000-0000-0000-0000-000000000001/password")
                .contentType(MediaType.APPLICATION_JSON).content("{\"password\":\"a-secure-temporary-password\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "inventory@example.test", roles = "INVENTORY_MANAGER")
    void inventoryManagerCannotOpenWebsiteCms() throws Exception {
        mvc.perform(get("/api/v1/cms/contact-form"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sales@example.test", roles = "SALES_AGENT")
    void salesAgentCannotManagePublicShowcase() throws Exception {
        mvc.perform(get("/api/v1/cms/showcase/PRODUCT"))
            .andExpect(status().isForbidden());
    }

    @Test
    void publicWebsiteCanSubmitAValidContactFormWithoutStaffAuthentication() throws Exception {
        mvc.perform(post("/api/v1/public/contact-form/submissions").contentType(MediaType.APPLICATION_JSON)
                .content("{\"fullName\":\"Amina El Idrissi\",\"email\":\"amina@example.test\",\"sourcePage\":\"/contact\",\"website\":\"\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.message").value("Thank you. Our team will contact you shortly."));
    }

    @Test
    @WithMockUser(username = "admin@example.test", roles = "ADMIN")
    void adminCanOpenUserAdministration() throws Exception {
        mvc.perform(get("/api/v1/users"))
            .andExpect(status().isOk());
    }

    @Test
    void anonymousUsersCannotReadUploadedDocuments() throws Exception {
        mvc.perform(get("/api/v1/uploads/documents/private-drawing.pdf"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void publicCatalogMediaUsesTheApiWithoutAStorageCredential() throws Exception {
        ImageStorage.UploadedImage uploaded = images.store(new MockMultipartFile(
            "file", "catalog.jpg", "image/jpeg", new byte[]{(byte) 0xff, (byte) 0xd8, (byte) 0xff}
        ));
        String filename = uploaded.url().substring(uploaded.url().lastIndexOf('/') + 1);

        mvc.perform(get("/api/v1/uploads/images/" + filename))
            .andExpect(status().isOk())
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.content().contentTypeCompatibleWith(MediaType.IMAGE_JPEG))
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header().string("X-Content-Type-Options", "nosniff"));
    }
}
