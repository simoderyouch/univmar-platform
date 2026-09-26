package com.univmar.cms;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class WebsiteFormRateLimiter {
    private final int maxPerMinute; private final ConcurrentHashMap<String, ArrayDeque<Instant>> attempts = new ConcurrentHashMap<>();
    public WebsiteFormRateLimiter(@Value("${univmar.web-lead.max-per-minute:12}") int maxPerMinute) { this.maxPerMinute = maxPerMinute; }
    public boolean allow(String address) { ArrayDeque<Instant> queue = attempts.computeIfAbsent(address == null ? "unknown" : address, ignored -> new ArrayDeque<>()); synchronized (queue) { Instant cutoff = Instant.now().minusSeconds(60); while (!queue.isEmpty() && queue.peekFirst().isBefore(cutoff)) queue.removeFirst(); if (queue.size() >= maxPerMinute) return false; queue.addLast(Instant.now()); return true; } }
}
