package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

/**
 * Streams imported catalogue media from private MinIO storage. This keeps the
 * browser away from storage credentials and direct object URLs.
 */
@RestController
@RequestMapping("/api/v1/uploads/base-gallery")
@ConditionalOnBean(S3ImageStorage.class)
public class BaseGalleryImageController {
    private static final String PREFIX = "/api/v1/uploads/base-gallery/";
    private final S3ImageStorage images;

    public BaseGalleryImageController(S3ImageStorage images) { this.images = images; }

    @GetMapping("/**")
    public ResponseEntity<InputStreamResource> image(HttpServletRequest request) {
        String requestPath = request.getRequestURI();
        int prefix = requestPath.indexOf(PREFIX);
        if (prefix < 0) throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        String path = UriUtils.decode(requestPath.substring(prefix + PREFIX.length()), StandardCharsets.UTF_8);
        ImageStorage.StoredImage stored = images.loadBaseGallery(path);
        MediaType contentType;
        try { contentType = MediaType.parseMediaType(stored.contentType()); }
        catch (IllegalArgumentException exception) { throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found."); }
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
            .header("X-Content-Type-Options", "nosniff")
            .contentType(contentType)
            .body(new InputStreamResource(stored.content()));
    }
}
