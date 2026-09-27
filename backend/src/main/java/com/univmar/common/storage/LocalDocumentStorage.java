package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;

@Service
public class LocalDocumentStorage {
    private static final long MAX_BYTES = 20L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.ofEntries(
        Map.entry("application/pdf", "pdf"), Map.entry("application/msword", "doc"), Map.entry("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"),
        Map.entry("application/vnd.ms-excel", "xls"), Map.entry("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"), Map.entry("text/csv", "csv"),
        Map.entry("image/jpeg", "jpg"), Map.entry("image/png", "png"), Map.entry("image/webp", "webp")
    );
    private static final String INTERNAL_DOCUMENT_PREFIX = "/api/v1/uploads/documents/";
    private static final Pattern STORED_FILENAME = Pattern.compile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(pdf|doc|docx|xls|xlsx|csv|jpg|png|webp)$", Pattern.CASE_INSENSITIVE);
    private final Path root; private final String publicApiUrl; private final S3ImageStorage s3;
    public LocalDocumentStorage(@Value("${univmar.storage.root}") String root, @Value("${univmar.storage.public-api-url}") String publicApiUrl,
            ObjectProvider<S3ImageStorage> s3Provider) { this.root = Path.of(root).toAbsolutePath().normalize(); this.publicApiUrl = publicApiUrl.replaceAll("/$", ""); this.s3 = s3Provider.getIfAvailable(); }
    public UploadedDocument store(MultipartFile file) {
        if (file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Select a document to upload.");
        if (file.getSize() > MAX_BYTES) throw new ApiException(HttpStatus.BAD_REQUEST, "DOCUMENT_TOO_LARGE", "Documents must be 20 MiB or smaller.");
        String contentType = Optional.ofNullable(file.getContentType()).orElse("").toLowerCase(Locale.ROOT); String extension = EXTENSIONS.get(contentType);
        if (extension == null) throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_DOCUMENT", "Upload a PDF, Office document, CSV, JPEG, PNG, or WebP file.");
        String filename = UUID.randomUUID() + "." + extension;
        if (s3 != null) s3.storePrivateDocument(filename, contentType, file);
        else try { Path documents = documentsDirectory(); Path destination = documents.resolve(filename).normalize(); if (!destination.startsWith(documents)) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "The file name is invalid."); Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING); } catch (IOException exception) { throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED", "The document could not be stored."); }
        return new UploadedDocument(INTERNAL_DOCUMENT_PREFIX + filename, Optional.ofNullable(file.getOriginalFilename()).filter(name -> !name.isBlank()).orElse("document." + extension), contentType, file.getSize());
    }
    public UploadedDocument storeWebsiteInquiryAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Select a file to upload.");
        if (file.getSize() > 10L * 1024 * 1024) throw new ApiException(HttpStatus.BAD_REQUEST, "ATTACHMENT_TOO_LARGE", "Each project attachment must be 10 MiB or smaller.");
        String contentType = Optional.ofNullable(file.getContentType()).orElse("").toLowerCase(Locale.ROOT);
        if (!(contentType.equals("application/pdf") || contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/webp"))) throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_ATTACHMENT", "Upload a PDF, JPEG, PNG, or WebP file.");
        return store(file);
    }

    /**
     * Attachments can only point at files this service generated.  Returning a
     * relative URL also keeps browser downloads on the configured API origin.
     */
    public String canonicalManagedUrl(String value) {
        String url = value == null ? "" : value.trim();
        String absolutePrefix = publicApiUrl + "/uploads/documents/";
        String filename = url.startsWith(INTERNAL_DOCUMENT_PREFIX) ? url.substring(INTERNAL_DOCUMENT_PREFIX.length())
            : url.startsWith(absolutePrefix) ? url.substring(absolutePrefix.length()) : null;
        if (filename == null || !STORED_FILENAME.matcher(filename).matches()) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DOCUMENT_URL", "Attach a document using the upload endpoint.");
        if (s3 != null) { if (!s3.privateDocumentExists(filename)) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DOCUMENT_URL", "The uploaded document was not found."); }
        else { Path document = documentsDirectory().resolve(filename).normalize(); if (!document.startsWith(documentsDirectory()) || !Files.isRegularFile(document)) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DOCUMENT_URL", "The uploaded document was not found."); }
        return INTERNAL_DOCUMENT_PREFIX + filename;
    }

    public boolean isManagedUrl(String value) {
        try { canonicalManagedUrl(value); return true; } catch (ApiException ignored) { return false; }
    }
    public StoredDocument loadManagedDocument(String value) {
        String canonical = canonicalManagedUrl(value);
        String filename = canonical.substring(INTERNAL_DOCUMENT_PREFIX.length());
        if (s3 != null) { var document = s3.loadPrivateDocument(filename); return new StoredDocument(new ByteArrayResource(document.content()), document.contentType(), filename); }
        try {
            Path file = documentsDirectory().resolve(filename).normalize();
            return new StoredDocument(new ByteArrayResource(Files.readAllBytes(file)), Files.probeContentType(file), filename);
        } catch (IOException exception) { throw new ApiException(HttpStatus.NOT_FOUND, "DOCUMENT_NOT_FOUND", "The uploaded document was not found."); }
    }

    private Path documentsDirectory() {
        Path documents = root.resolve("documents").normalize();
        try { Files.createDirectories(documents); } catch (IOException exception) { throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED", "The document storage could not be prepared."); }
        return documents;
    }
    public record UploadedDocument(String url, String originalFilename, String contentType, long size) { }
    public record StoredDocument(ByteArrayResource resource, String contentType, String filename) { }
}
