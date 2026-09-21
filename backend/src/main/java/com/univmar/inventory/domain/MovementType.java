package com.univmar.inventory.domain;

public enum MovementType {
    INITIAL_STOCK,
    PURCHASE_RECEIPT,
    ADJUSTMENT_IN,
    ADJUSTMENT_OUT,
    DAMAGE,
    RETURN,
    ORDER_RESERVATION,
    ORDER_RESERVATION_RELEASE,
    ORDER_DELIVERY
}
