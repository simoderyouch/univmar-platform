package com.univmar.cms;

import com.univmar.cms.domain.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Delivers saved inquiries after the HTTP request; an email outage never discards a form submission. */
@Service
public class WebsiteInquiryNotificationService {
    private final WebsiteInquiryRepository inquiries; private final ObjectProvider<JavaMailSender> sender; private final boolean enabled; private final String recipient; private final String from;
    public WebsiteInquiryNotificationService(WebsiteInquiryRepository inquiries, ObjectProvider<JavaMailSender> sender, @Value("${univmar.website-email.enabled:false}") boolean enabled, @Value("${univmar.website-email.to:}") String recipient, @Value("${univmar.website-email.from:}") String from) { this.inquiries = inquiries; this.sender = sender; this.enabled = enabled; this.recipient = recipient.trim(); this.from = from.trim(); }
    @Scheduled(fixedDelayString = "${univmar.website-email.retry-delay-ms:60000}")
    @Transactional
    public void deliverPending() { JavaMailSender mailer = sender.getIfAvailable(); if (!enabled || recipient.isBlank() || mailer == null) return; List<WebsiteInquiry> pending = inquiries.findTop25ByNotificationStatusInOrderByCreatedAtAsc(List.of(WebsiteInquiryNotificationStatus.PENDING, WebsiteInquiryNotificationStatus.FAILED)); pending.forEach(inquiry -> deliver(mailer, inquiry)); }
    private void deliver(JavaMailSender mailer, WebsiteInquiry inquiry) { try { SimpleMailMessage message = new SimpleMailMessage(); message.setTo(recipient); if (!from.isBlank()) message.setFrom(from); if (inquiry.getEmail() != null) message.setReplyTo(inquiry.getEmail()); message.setSubject("[UNIVMAR website] " + (inquiry.getSubject() == null ? "New enquiry" : inquiry.getSubject())); message.setText(content(inquiry)); mailer.send(message); inquiry.notificationSent(); } catch (RuntimeException exception) { inquiry.notificationFailed(exception.getMessage()); }
    }
    private String content(WebsiteInquiry item) { return String.join("\n", "New website enquiry", "", "Name: " + item.getFullName(), "Email: " + blank(item.getEmail()), "Phone: " + blank(item.getPhone()), "Subject: " + blank(item.getSubject()), "Language: " + blank(item.getLanguage()), "Source page: " + blank(item.getSourcePage()), "Products: " + blank(item.getSelectedProducts()), "Campaign: " + blank(item.getUtmSource()) + " / " + blank(item.getUtmMedium()) + " / " + blank(item.getUtmCampaign()), "", "Message:", blank(item.getMessage())); }
    private String blank(String value) { return value == null ? "—" : value; }
}
