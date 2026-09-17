package com.univmar.catalog.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum StoneType {
    MARBLE, GRANITE, TRAVERTINE, LIMESTONE, QUARTZITE, ONYX, OTHER;

    @JsonCreator
    public static StoneType from(String value) {
        return valueOf(value.trim().replace(' ', '_').toUpperCase(Locale.ROOT));
    }
}
