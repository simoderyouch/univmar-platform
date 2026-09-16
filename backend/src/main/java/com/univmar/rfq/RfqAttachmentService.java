package com.univmar.rfq;

import com.univmar.audit.AuditService;
import com.univmar.rfq.api.RfqAttachmentDtos;
import com.univmar.rfq.domain.QuoteRequest;
import com.univmar.rfq.domain.QuoteRequestRepository;
import com.univmar.rfq.domain.RfqAttachment;
import com.univmar.rfq.domain.RfqAttachmentRepository;
import com.univmar.shared.api.ApiException;
import com.univmar.user.domain.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RfqAttachmentService {
    private static final long MAX_BYTES = 10L * 1024 * 1024;
    private static final Set<String> TYPES = Set.of("application/pdf", "image/jpeg", "image/png");
    private final QuoteRequestRepository requests;
    private final RfqAttachmentRepository attachments;
    private final UserRepository users;
    private final AuditService audit;
    private final Path root;

    public RfqAttachmentService(QuoteRequestRepository requests, RfqAttachmentRepository attachments, UserRepository users, AuditService audit, @Value("${univmar.storage.root:./data/uploads}") String root) {
        this.requests = requests;
        this.attachments = attachments;
        this.users = users;
        this.audit = audit;
        this.root = Path.of(root).toAbsolutePath().normalize();
    }

    @Transactional
    public RfqAttachmentDtos.Response upload(Long requestId, Long customerId, MultipartFile file) {
        QuoteRequest request = owned(requestId, customerId);
        validate(file);
        String key = UUID.randomUUID() + extension(file.getOriginalFilename());
        Path target = root.resolve(key).normalize();
        if (!target.startsWith(root)) throw ApiException.forbidden();
        try {
            Files.createDirectories(root);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "ATTACHMENT_STORAGE_ERROR", "Attachment could not be stored");
        }
        try {
            RfqAttachment saved = attachments.save(new RfqAttachment(request, safeName(file.getOriginalFilename()), file.getContentType(), file.getSize(), key, users.findById(customerId).orElseThrow(() -> ApiException.notFound("Customer"))));
            audit.record(customerId, "RFQ_ATTACHMENT_UPLOADED", "RFQ", requestId, saved.getOriginalFilename());
            return response(saved);
        } catch (RuntimeException e) {
            try {
                Files.deleteIfExists(target);
            } catch (IOException ignored) {
            }
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<RfqAttachmentDtos.Response> mine(Long requestId, Long customerId) {
        owned(requestId, customerId);
        return attachments.findByRequestIdOrderByCreatedAtDesc(requestId).stream().map(this::response).toList();
    }

    @Transactional(readOnly = true)
    public List<RfqAttachmentDtos.Response> sales(Long requestId) {
        find(requestId);
        return attachments.findByRequestIdOrderByCreatedAtDesc(requestId).stream().map(this::response).toList();
    }

    @Transactional(readOnly = true)
    public Download mineDownload(Long id, Long customerId) {
        return download(attachments.findByIdAndRequestCustomerId(id, customerId).orElseThrow(ApiException::forbidden));
    }

    @Transactional(readOnly = true)
    public Download salesDownload(Long id) {
        return download(attachments.findById(id).orElseThrow(() -> ApiException.notFound("Attachment")));
    }

    private Download download(RfqAttachment a) {
        try {
            Resource resource = new UrlResource(root.resolve(a.getStorageKey()).normalize().toUri());
            if (!resource.exists() || !resource.isReadable()) throw ApiException.notFound("Attachment file");
            return new Download(resource, a.getOriginalFilename(), a.getContentType());
        } catch (java.net.MalformedURLException e) {
            throw ApiException.notFound("Attachment file");
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ATTACHMENT", "Attachment is required");
        if (file.getSize() > MAX_BYTES)
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ATTACHMENT", "Attachment exceeds the 10 MB limit");
        if (!TYPES.contains(file.getContentType()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ATTACHMENT", "Only PDF, JPEG and PNG attachments are allowed");
    }

    private QuoteRequest owned(Long id, Long customerId) {
        QuoteRequest r = find(id);
        if (!r.getCustomer().getId().equals(customerId)) throw ApiException.forbidden();
        return r;
    }

    private QuoteRequest find(Long id) {
        return requests.findById(id).orElseThrow(() -> ApiException.notFound("RFQ"));
    }

    private RfqAttachmentDtos.Response response(RfqAttachment x) {
        return new RfqAttachmentDtos.Response(x.getId(), x.getOriginalFilename(), x.getContentType(), x.getSizeBytes(), x.getUploadedBy().getId(), x.getCreatedAt());
    }

    private String safeName(String name) {
        return name == null ? "attachment" : name.replaceAll("[^a-zA-Z0-9._ -]", "_");
    }

    private String extension(String name) {
        if (name == null) return "";
        int dot = name.lastIndexOf('.');
        return dot < 0 ? "" : name.substring(dot).replaceAll("[^a-zA-Z0-9.]", "");
    }

    public record Download(Resource resource, String filename, String contentType) {
    }
}
