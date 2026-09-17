package com.univmar.catalog.domain;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum Finish {
    POLISHED, HONED, BRUSHED, LEATHERED, FLAMED, SANDBLASTED, OTHER;

    @JsonCreator
    public static Finish from(String value) {
        return valueOf(value.trim().replace(' ', '_').toUpperCase(Locale.ROOT));
    }
}
