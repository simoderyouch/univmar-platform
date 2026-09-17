package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalImageStorage {
    private static final Map<String, String> EXTENSIONS = Map.of(
        "image/jpeg", "jpg", "image/png", "png", "image/webp", "webp"
    );
    private final Path root;
    private final String publicApiUrl;

    public LocalImageStorage(@Value("${univmar.storage.root}") String root,
                             @Value("${univmar.storage.public-api-url}") String publicApiUrl) {
        this.root = Path.of(root).toAbsolutePath().normalize();
        this.publicApiUrl = publicApiUrl.replaceAll("/$", "");
    }

    public UploadedImage store(MultipartFile file) {
        if (file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Select an image to upload.");
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String extension = EXTENSIONS.get(contentType);
        if (extension == null) throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_IMAGE", "Only JPEG, PNG, and WebP images are accepted.");
        try {
            Path images = root.resolve("images");
            Files.createDirectories(images);
            String filename = UUID.randomUUID() + "." + extension;
            Path destination = images.resolve(filename).normalize();
            if (!destination.startsWith(images)) throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "The file name is invalid.");
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return new UploadedImage(publicApiUrl + "/uploads/images/" + filename, file.getOriginalFilename());
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED", "The image could not be stored.");
        }
    }

    public record UploadedImage(String url, String originalFilename) { }
}
