package com.univmar.supplier;

import com.univmar.common.api.ApiException;
import com.univmar.supplier.api.SupplierDtos.*;
import com.univmar.supplier.domain.*;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @Transactional
public class SupplierService {
    private final SupplierRepository suppliers;
    public SupplierService(SupplierRepository suppliers) { this.suppliers = suppliers; }
    public SupplierResponse create(SupplierInput input) { String name = required(input.name()); suppliers.findByNameIgnoreCase(name).ifPresent(item -> { throw conflict("DUPLICATE_SUPPLIER", "A supplier with this name already exists."); }); return response(suppliers.save(build(input))); }
    public SupplierResponse update(UUID id, SupplierInput input) { Supplier supplier = entity(id); String name = required(input.name()); suppliers.findByNameIgnoreCase(name).filter(item -> !item.getId().equals(id)).ifPresent(item -> { throw conflict("DUPLICATE_SUPPLIER", "A supplier with this name already exists."); }); apply(supplier, input); return response(supplier); }
    @Transactional(readOnly = true) public SupplierResponse detail(UUID id) { return response(entity(id)); }
    @Transactional(readOnly = true) public SupplierPage list(String search, String country, Boolean active, Pageable pageable) { Specification<Supplier> spec = Specification.where(null); if (search != null && !search.isBlank()) { String term = "%" + search.trim().toLowerCase(Locale.ROOT) + "%"; spec = spec.and((root, query, cb) -> cb.or(cb.like(cb.lower(root.get("name")), term), cb.like(cb.lower(root.get("contactName")), term), cb.like(cb.lower(root.get("email")), term))); } if (country != null && !country.isBlank()) spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("country")), country.trim().toLowerCase(Locale.ROOT))); if (active != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("active"), active)); return SupplierPage.from(suppliers.findAll(spec, pageable).map(this::response)); }
    public SupplierResponse active(UUID id, boolean active) { Supplier supplier = entity(id); supplier.setActive(active); return response(supplier); }
    private Supplier build(SupplierInput input) { return new Supplier(required(input.name()), trim(input.contactName()), trim(input.country()), trim(input.email()), trim(input.phone()), trim(input.address()), trim(input.materialsSupplied()), trim(input.paymentTerms()), input.leadTimeDays(), trim(input.notes())); }
    private void apply(Supplier supplier, SupplierInput input) { supplier.update(required(input.name()), trim(input.contactName()), trim(input.country()), trim(input.email()), trim(input.phone()), trim(input.address()), trim(input.materialsSupplied()), trim(input.paymentTerms()), input.leadTimeDays(), trim(input.notes())); }
    private Supplier entity(UUID id) { return suppliers.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SUPPLIER_NOT_FOUND", "Supplier was not found.")); }
    private SupplierResponse response(Supplier item) { return new SupplierResponse(item.getId(), item.getName(), item.getContactName(), item.getCountry(), item.getEmail(), item.getPhone(), item.getAddress(), item.getMaterialsSupplied(), item.getPaymentTerms(), item.getLeadTimeDays(), item.getNotes(), item.isActive()); }
    private String trim(String value) { return value == null || value.isBlank() ? null : value.trim(); } private String required(String value) { String result = trim(value); if (result == null) throw new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "A required value is missing."); return result; } private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
