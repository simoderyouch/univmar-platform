package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Service
@ConditionalOnProperty(name = "univmar.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalImageStorage implements ImageStorage {
    private static final Map<String, String> EXTENSIONS = Map.of(
        "image/jpeg", "jpg", "image/png", "png", "image/webp", "webp"
    );
    private static final Pattern STORED_FILENAME = Pattern.compile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png|webp)$", Pattern.CASE_INSENSITIVE);
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

    @Override
    public StoredImage load(String filename) {
        if (filename == null || !STORED_FILENAME.matcher(filename).matches()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        }
        Path image = root.resolve("images").resolve(filename).normalize();
        if (!image.startsWith(root.resolve("images").normalize())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        }
        try {
            InputStream content = Files.newInputStream(image);
            return new StoredImage(content, contentType(filename));
        } catch (NoSuchFileException exception) {
            throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "IMAGE_READ_FAILED", "The image could not be read.");
        }
    }

    private String contentType(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        return lower.endsWith(".png") ? "image/png" : lower.endsWith(".webp") ? "image/webp" : "image/jpeg";
    }

}
