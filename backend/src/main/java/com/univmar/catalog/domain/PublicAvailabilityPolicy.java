package com.univmar.catalog.domain;

/** Controls what a visitor is told about a sellable catalogue variant. */
public enum PublicAvailabilityPolicy {
    AUTO,
    AVAILABLE_ON_ORDER,
    SHOWROOM_SELECTION,
    HIDDEN
}
