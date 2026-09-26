package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.time.Duration;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The only route that reads catalogue images from storage. The storage bucket
 * stays private; browsers receive an API URL without storage credentials.
 */
@RestController
@RequestMapping("/api/v1/uploads/images")
public class PublicImageController {
    private final ImageStorage images;

    public PublicImageController(ImageStorage images) { this.images = images; }

    @GetMapping(value = "/{filename:.+}")
    public ResponseEntity<InputStreamResource> image(@PathVariable String filename) {
        ImageStorage.StoredImage stored = images.load(filename);
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
