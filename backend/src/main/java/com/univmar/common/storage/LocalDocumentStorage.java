package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalDocumentStorage {
    private static final long MAX_BYTES = 20L * 1024 * 1024;
    private static final Map<String, String> EXTENSIONS = Map.ofEntries(
        Map.entry("application/pdf", "pdf"), Map.entry("application/msword", "doc"), Map.entry("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"),
        Map.entry("application/vnd.ms-excel", "xls"), Map.entry("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"), Map.entry("text/csv", "csv"),
        Map.entry("image/jpeg", "jpg"), Map.entry("image/png", "png"), Map.entry("image/webp", "webp")
    );
    private final Path root; private final String publicApiUrl;
    public LocalDocumentStorage(@Value("${univmar.storage.root}") String root, @Value("${univmar.storage.public-api-url}") String publicApiUrl) { this.root = Path.of(root).toAbsolutePath().normalize(); this.publicApiUrl = publicApiUrl.replaceAll("/$", ""); }
    public UploadedDocument store(MultipartFile file) {
        if (file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Select a document to upload.");
        if (file.getSize() > MAX_BYTES) throw new ApiException(HttpStatus.BAD_REQUEST, "DOCUMENT_TOO_LARGE", "Documents must be 20 MiB or smaller.");
        String contentType = Optional.ofNullable(file.getContentType()).orElse("").toLowerCase(Locale.ROOT); String extension = EXTENSIONS.get(contentType);
        if (extension == null) throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_DOCUMENT", "Upload a PDF, Office document, CSV, JPEG, PNG, or WebP file.");
        try { Path documents = root.resolve("documents"); Files.createDirectories(documents); String filename = UUID.randomUUID() + "." + extension; Path destination = documents.resolve(filename).normalize(); if (!destination.startsWith(documents)) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "The file name is invalid."); Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING); return new UploadedDocument(publicApiUrl + "/uploads/documents/" + filename, Optional.ofNullable(file.getOriginalFilename()).filter(name -> !name.isBlank()).orElse("document." + extension), contentType, file.getSize()); } catch (IOException exception) { throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED", "The document could not be stored."); }
    }
    public record UploadedDocument(String url, String originalFilename, String contentType, long size) { }
}
