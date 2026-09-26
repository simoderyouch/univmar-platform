package com.univmar.quotation;

import com.univmar.auth.AccessControlService;
import com.univmar.common.api.ApiException;
import com.univmar.customer.domain.*;
import com.univmar.delivery.domain.DeliveryRepository;
import com.univmar.order.domain.*;
import com.univmar.project.domain.*;
import com.univmar.quotation.api.QuotationDtos.*;
import com.univmar.quotation.domain.*;
import com.univmar.rfq.domain.*;
import com.univmar.user.domain.UserRepository;
import jakarta.mail.internet.MimeMessage;
import java.math.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuotationService {

    private final QuotationRepository quotations;
    private final CustomerRepository customers;
    private final ProjectRepository projects;
    private final QuoteRequestRepository rfqs;
    private final UserRepository users;
    private final AccessControlService access;
    private final SalesOrderRepository orders;
    private final DeliveryRepository deliveries;
    private final QuotationDispatchRepository dispatches;
    private final ObjectProvider<JavaMailSender> mailer;
    private final QuotationPdfRenderer pdf;
    private final boolean emailEnabled;
    private final String emailFrom;
    private final String publicBaseUrl;

    public QuotationService(
        QuotationRepository quotations,
        CustomerRepository customers,
        ProjectRepository projects,
        QuoteRequestRepository rfqs,
        UserRepository users,
        AccessControlService access,
        SalesOrderRepository orders,
        DeliveryRepository deliveries,
        QuotationDispatchRepository dispatches,
        ObjectProvider<JavaMailSender> mailer,
        QuotationPdfRenderer pdf,
        @Value("${univmar.quotation-email.enabled:false}") boolean emailEnabled,
        @Value("${univmar.quotation-email.from:}") String emailFrom,
        @Value(
            "${univmar.quotation-email.public-base-url:http://localhost:3001/fr/quote}"
        ) String publicBaseUrl
    ) {
        this.quotations = quotations;
        this.customers = customers;
        this.projects = projects;
        this.rfqs = rfqs;
        this.users = users;
        this.access = access;
        this.orders = orders;
        this.deliveries = deliveries;
        this.dispatches = dispatches;
        this.mailer = mailer;
        this.pdf = pdf;
        this.emailEnabled = emailEnabled;
        this.emailFrom = emailFrom == null ? "" : emailFrom.trim();
        this.publicBaseUrl =
            publicBaseUrl == null ? "" : publicBaseUrl.replaceAll("/+$", "");
    }

    public Response create(Input input) {
        Customer customer = customers
            .findById(input.customerId())
            .orElseThrow(() -> notFound("CUSTOMER_NOT_FOUND"));
        Project project = projects
            .findById(input.projectId())
            .orElseThrow(() -> notFound("PROJECT_NOT_FOUND"));
        if (!project.getCustomer().getId().equals(customer.getId())) throw bad(
            "PROJECT_CUSTOMER_MISMATCH"
        );
        QuoteRequest rfq =
            input.rfqId() == null
                ? null
                : rfqs
                      .findById(input.rfqId())
                      .orElseThrow(() -> notFound("RFQ_NOT_FOUND"));
        if (
            rfq != null &&
            (!rfq.getCustomer().getId().equals(customer.getId()) ||
                !rfq.getProject().getId().equals(project.getId()))
        ) throw bad("RFQ_REFERENCE_MISMATCH");
        Quotation quote = new Quotation(
            nextNumber(),
            customer,
            project,
            rfq,
            actor(),
            input.expiryDate(),
            input.transport(),
            trim(input.paymentTerms()),
            trim(input.notes()),
            1
        );
        input.items().forEach(item -> quote.add(item(quote, item)));
        return out(quotations.save(quote));
    }

    public Response update(UUID id, Input input) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        if (quote.getStatus() != QuotationStatus.DRAFT) throw bad(
            "QUOTE_NOT_DRAFT"
        );
        quote.update(
            input.expiryDate(),
            input.transport(),
            trim(input.paymentTerms()),
            trim(input.notes())
        );
        quote.replaceItems(
            input
                .items()
                .stream()
                .map(item -> item(quote, item))
                .toList()
        );
        return out(quote);
    }

    /** Sends a PDF email and creates a single-use, opaque client link. */
    public SendResult send(UUID id, SendInput input) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        ensureSendable(quote);
        String token = token();
        String subject = blank(input.subject())
            ? "Devis " + quote.getNumber() + " - UNIVMAR"
            : input.subject().trim();

        QuotationDispatch dispatch = dispatches.save(
            new QuotationDispatch(
                quote,
                QuotationDispatchChannel.EMAIL,
                input.recipientEmail().trim(),
                trim(input.ccEmails()),
                subject,
                blank(input.message())
                    ? defaultMessage(quote)
                    : input.message().trim(),
                hash(token),
                actor()
            )
        );
        String publicUrl = publicUrl(token);
        try {
            deliverEmail(quote, dispatch, publicUrl);
            dispatch.sent();
            markSent(quote);
        } catch (RuntimeException exception) {
            dispatch.failed(safeMessage(exception));
        }
        return new SendResult(out(quote), dispatch(dispatch), publicUrl);
    }

    /** Compatibility path used by existing internal workflow tests and imports. */
    public Response send(UUID id) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        ensureSendable(quote);
        markSent(quote);
        return out(quote);
    }

    /** Lets sales copy an expiring opaque link into WhatsApp while keeping the same audit history. */
    public SendResult createShareLink(UUID id) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        ensureSendable(quote);
        String token = token();
        QuotationDispatch dispatch = dispatches.save(
            new QuotationDispatch(
                quote,
                QuotationDispatchChannel.SHARE_LINK,
                null,
                null,
                "Secure quotation link",
                null,
                hash(token),
                actor()
            )
        );
        dispatch.sent();
        markSent(quote);
        return new SendResult(out(quote), dispatch(dispatch), publicUrl(token));
    }

    @Transactional(readOnly = true)
    public PublicResponse publicDetail(String token) {
        return publicResponse(publicDispatch(token, false));
    }

    public PublicResponse recordClientResponse(
        String token,
        ClientResponseInput input
    ) {
        QuotationDispatch dispatch = publicDispatch(token, true);
        if (
            dispatch.getClientResponse() != QuotationClientResponse.PENDING
        ) throw conflict(
            "CLIENT_RESPONSE_RECORDED",
            "This quotation link has already received a response."
        );
        try {
            dispatch.respond(
                input.response(),
                input.name().trim() +
                    (blank(input.email())
                        ? ""
                        : " <" + input.email().trim() + ">"),
                trim(input.message())
            );
        } catch (IllegalStateException exception) {
            throw conflict("CLIENT_RESPONSE_RECORDED", exception.getMessage());
        }
        return publicResponse(dispatch);
    }

    public Response reject(UUID id) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        if (quote.getStatus() != QuotationStatus.SENT) throw bad(
            "QUOTE_NOT_SENT"
        );
        quote.status(QuotationStatus.REJECTED);
        return out(quote);
    }

    public Response expire(UUID id) {
        Quotation quote = entity(id);
        access.requireSalesOwnership(quote.getSalesAgent(), "quotation");
        if (quote.getStatus() != QuotationStatus.SENT) throw bad(
            "QUOTE_NOT_SENT"
        );
        quote.status(QuotationStatus.EXPIRED);
        return out(quote);
    }

    @Transactional(readOnly = true)
    public Response detail(UUID id) {
        return out(entity(id));
    }

    @Transactional(readOnly = true)
    public PageResult list(QuotationStatus status, Pageable page) {
        return PageResult.from(
            (status == null
                ? quotations.findAll(page)
                : quotations.findAllByStatus(status, page)
            ).map(this::out)
        );
    }

    private QuotationDispatch publicDispatch(String token, boolean locked) {
        String digest = hash(token);
        QuotationDispatch dispatch = (
            locked
                ? dispatches.findByTokenHashForUpdate(digest)
                : dispatches.findByTokenHash(digest)
        ).orElseThrow(() -> notFound("QUOTATION_LINK_NOT_FOUND"));
        Quotation quote = dispatch.getQuotation();
        if (
            dispatch.getStatus() != QuotationDispatchStatus.SENT ||
            quote.getStatus() != QuotationStatus.SENT ||
            quote.getExpiryDate() == null ||
            quote.getExpiryDate().isBefore(LocalDate.now())
        ) throw conflict(
            "QUOTATION_LINK_INACTIVE",
            "This quotation link is no longer active."
        );
        return dispatch;
    }

    private PublicResponse publicResponse(QuotationDispatch dispatch) {
        Quotation quote = dispatch.getQuotation();
        return new PublicResponse(
            quote.getNumber(),
            quote.getCustomer().getName(),
            quote.getProject().getName(),
            quote.getExpiryDate(),
            quote.getPaymentTerms(),
            quote.getNotes(),
            quote.getStatus(),
            quote.getSubtotal(),
            quote.getTaxTotal(),
            quote.getTransport(),
            quote.getGrandTotal(),
            lines(quote),
            dispatch.getClientResponse()
        );
    }

    private void ensureSendable(Quotation quote) {
        if (
            quote.getStatus() != QuotationStatus.DRAFT &&
            quote.getStatus() != QuotationStatus.SENT
        ) throw bad("QUOTE_NOT_SENDABLE");
        if (
            quote.getExpiryDate() == null ||
            quote.getExpiryDate().isBefore(LocalDate.now())
        ) throw bad("INVALID_EXPIRY");
    }

    private void markSent(Quotation quote) {
        if (quote.getStatus() == QuotationStatus.DRAFT) {
            quote.status(QuotationStatus.SENT);
            if (
                quote.getRfq() != null &&
                quote.getRfq().getStatus() != RfqStatus.QUOTED
            ) quote.getRfq().transitionTo(RfqStatus.QUOTED);
        }
    }

    private void deliverEmail(
        Quotation quote,
        QuotationDispatch dispatch,
        String publicUrl
    ) {
        if (!emailEnabled) throw new IllegalStateException(
            "Quotation email sending is disabled. Set UNIVMAR_QUOTATION_EMAIL_ENABLED=true after SMTP is configured."
        );
        JavaMailSender sender = mailer.getIfAvailable();
        if (sender == null) throw new IllegalStateException(
            "SMTP is not configured."
        );
        MimeMessage mail = sender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(
                mail,
                true,
                StandardCharsets.UTF_8.name()
            );
            helper.setTo(dispatch.getRecipientEmail());
            if (!blank(dispatch.getCcEmails())) helper.setCc(
                Arrays.stream(dispatch.getCcEmails().split("[,;]"))
                    .map(String::trim)
                    .filter(value -> !value.isBlank())
                    .toArray(String[]::new)
            );
            if (!emailFrom.isBlank()) {
                helper.setFrom(emailFrom);
                helper.setReplyTo(emailFrom);
            }
            helper.setSubject(dispatch.getSubject());
            helper.setText(
                dispatch.getMessage() +
                    "\n\nConsultez votre devis en ligne : " +
                    publicUrl +
                    "\n\nCe lien est personnel et expire le " +
                    quote.getExpiryDate() +
                    ".",
                false
            );
            helper.addAttachment(
                quote.getNumber() + ".pdf",
                new ByteArrayResource(pdf.render(quote)),
                "application/pdf"
            );
            sender.send(mail);
        } catch (Exception exception) {
            throw new IllegalStateException(
                exception.getMessage() == null
                    ? "SMTP delivery failed."
                    : exception.getMessage(),
                exception
            );
        }
    }

    private Response out(Quotation quote) {
        SalesOrder order = orders.findByQuotationId(quote.getId()).orElse(null);
        int deliveryCount =
            order == null
                ? 0
                : Math.toIntExact(deliveries.countByOrderId(order.getId()));
        return new Response(
            quote.getId(),
            quote.getNumber(),
            quote.getCustomer().getId(),
            quote.getCustomer().getName(),
            quote.getCustomer().getEmail(),
            quote.getProject().getId(),
            quote.getProject().getName(),
            quote.getRfq() == null ? null : quote.getRfq().getId(),
            quote.getSalesAgent(),
            quote.getExpiryDate(),
            quote.getTransport(),
            quote.getPaymentTerms(),
            quote.getNotes(),
            quote.getStatus(),
            quote.getRevision(),
            quote.getSubtotal(),
            quote.getTaxTotal(),
            quote.getGrandTotal(),
            order == null ? null : order.getId(),
            deliveryCount,
            quote.getCreatedAt(),
            lines(quote),
            dispatches
                .findAllByQuotationIdOrderByCreatedAtDesc(quote.getId())
                .stream()
                .map(this::dispatch)
                .toList()
        );
    }

    private List<Line> lines(Quotation quote) {
        return quote
            .getItems()
            .stream()
            .map(value ->
                new Line(
                    value.getId(),
                    value.getVariantId(),
                    value.getMaterialName(),
                    value.getVariantLabel(),
                    value.getQuantityM2(),
                    value.getUnitPrice(),
                    value.getDiscountPercent(),
                    value.getTaxPercent(),
                    value.net(),
                    value.tax(),
                    value.net().add(value.tax())
                )
            )
            .toList();
    }

    private Dispatch dispatch(QuotationDispatch value) {
        return new Dispatch(
            value.getId(),
            value.getChannel(),
            value.getStatus(),
            value.getRecipientEmail(),
            value.getCcEmails(),
            value.getSubject(),
            value.getSentBy(),
            value.getSentAt(),
            value.getFailureReason(),
            value.getClientResponse(),
            value.getRespondedBy(),
            value.getResponseMessage(),
            value.getRespondedAt(),
            value.getCreatedAt()
        );
    }

    private QuotationItem item(Quotation quote, Item value) {
        return new QuotationItem(
            quote,
            value.variantId(),
            trim(value.materialName()),
            trim(value.variantLabel()),
            value.quantityM2(),
            value.unitPrice(),
            value.discountPercent(),
            value.taxPercent()
        );
    }

    private Quotation entity(UUID id) {
        return quotations
            .findById(id)
            .orElseThrow(() -> notFound("QUOTATION_NOT_FOUND"));
    }

    private String nextNumber() {
        return (
            "QT-" +
            LocalDate.now().toString().replace("-", "") +
            "-" +
            UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase(Locale.ROOT)
        );
    }

    private String actor() {
        var current = SecurityContextHolder.getContext().getAuthentication();
        try {
            return current == null
                ? "System"
                : users
                      .findById(UUID.fromString(current.getName()))
                      .map(user -> user.getEmail())
                      .orElse("System");
        } catch (Exception ignored) {
            return "System";
        }
    }

    private String publicUrl(String token) {
        return publicBaseUrl + "/" + token;
    }

    private String token() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(
                value.getBytes(StandardCharsets.UTF_8)
            );
            StringBuilder result = new StringBuilder();
            for (byte item : digest) result.append(String.format("%02x", item));
            return result.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(exception);
        }
    }

    private String defaultMessage(Quotation quote) {
        return (
            "Bonjour,\n\nVeuillez trouver ci-joint notre devis " +
            quote.getNumber() +
            " pour le projet " +
            quote.getProject().getName() +
            ".\n\nCordialement,\nUNIVMAR"
        );
    }

    private String safeMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank()
            ? "SMTP delivery failed."
            : message;
    }

    private String trim(String value) {
        return blank(value) ? null : value.trim();
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private ApiException notFound(String code) {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            code,
            "Reference was not found."
        );
    }

    private ApiException bad(String code) {
        return new ApiException(
            HttpStatus.CONFLICT,
            code,
            "The quotation cannot be changed in its current state."
        );
    }

    private ApiException conflict(String code, String message) {
        return new ApiException(HttpStatus.CONFLICT, code, message);
    }
}
