package com.univmar.catalog;

import com.univmar.catalog.api.PublicCatalogDtos.PublicAvailability;
import com.univmar.catalog.domain.*;
import com.univmar.inventory.domain.InventoryItemRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;

/**
 * Keeps stock math inside the ERP.  This class deliberately returns a public
 * state only; quantities, reservations, lots and warehouse locations never
 * cross the public API boundary.
 */
@Service
public class PublicAvailabilityService {
    private final InventoryItemRepository inventory;

    public PublicAvailabilityService(InventoryItemRepository inventory) { this.inventory = inventory; }

    public boolean visible(StoneVariant variant) {
        return variant.isActive() && variant.getPublicAvailabilityPolicy() != PublicAvailabilityPolicy.HIDDEN;
    }

    public PublicAvailability response(StoneVariant variant) {
        PublicAvailabilityCode code = switch (variant.getPublicAvailabilityPolicy()) {
            case AVAILABLE_ON_ORDER -> PublicAvailabilityCode.AVAILABLE_ON_ORDER;
            case SHOWROOM_SELECTION -> PublicAvailabilityCode.SHOWROOM_SELECTION;
            case AUTO -> hasSellableStock(variant) ? PublicAvailabilityCode.AVAILABLE : PublicAvailabilityCode.AVAILABLE_ON_ORDER;
            case HIDDEN -> throw new IllegalArgumentException("Hidden variants have no public availability.");
        };
        return switch (code) {
            case AVAILABLE -> new PublicAvailability(code.name(), "Available — confirm quantity with our team");
            case AVAILABLE_ON_ORDER -> new PublicAvailability(code.name(), "Available on order");
            case SHOWROOM_SELECTION -> new PublicAvailability(code.name(), "Select your slab at our showroom");
        };
    }

    private boolean hasSellableStock(StoneVariant variant) {
        return inventory.findAllByVariantId(variant.getId()).stream()
            .map(item -> item.getAvailableM2())
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .compareTo(BigDecimal.ZERO) > 0;
    }
}
