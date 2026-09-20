package com.univmar.supplier.api;

import jakarta.validation.constraints.*;
import java.util.UUID;
import org.springframework.data.domain.Page;
import com.univmar.catalog.api.CatalogDtos.PageResult;

public final class SupplierDtos {
    private SupplierDtos() { }
    public record SupplierInput(@NotBlank @Size(max = 180) String name, @Size(max = 120) String contactName, @Size(max = 100) String country, @Email @Size(max = 180) String email, @Size(max = 60) String phone, @Size(max = 4000) String address, @Size(max = 4000) String materialsSupplied, @Size(max = 160) String paymentTerms, @PositiveOrZero Integer leadTimeDays, @Size(max = 4000) String notes) { }
    public record ActiveInput(boolean active) { }
    public record SupplierResponse(UUID id, String name, String contactName, String country, String email, String phone, String address, String materialsSupplied, String paymentTerms, Integer leadTimeDays, String notes, boolean active) { }
    public record SupplierPage(java.util.List<SupplierResponse> content, int page, int size, long totalElements, int totalPages) { public static SupplierPage from(Page<SupplierResponse> page) { return new SupplierPage(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages()); } }
}
