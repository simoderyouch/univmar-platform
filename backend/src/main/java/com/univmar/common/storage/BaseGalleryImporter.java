package com.univmar.common.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnBean(S3ImageStorage.class)
public class BaseGalleryImporter {
    private static final Logger log = LoggerFactory.getLogger(BaseGalleryImporter.class);
    private final S3ImageStorage storage;
    private final Path source;

    public BaseGalleryImporter(S3ImageStorage storage, @Value("${univmar.storage.s3.base-gallery-source:../base-gallery}") String source) {
        this.storage = storage;
        this.source = Path.of(source).toAbsolutePath().normalize();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void importGallery() {
        if (!Files.isDirectory(source)) { log.info("Base gallery source {} is not present; skipping import", source); return; }
        try (Stream<Path> files = Files.walk(source)) {
            files.filter(Files::isRegularFile).forEach(this::importOne);
        } catch (IOException exception) { log.warn("Could not scan base gallery {}", source, exception); }
    }

    private void importOne(Path file) {
        String key = "base-gallery/" + source.relativize(file).toString().replace('\\', '/');
        if (storage.exists(key)) return;
        try {
            String contentType = Files.probeContentType(file);
            if (contentType == null) contentType = contentType(file);
            storage.importFile(file, key, contentType);
            log.info("Imported base gallery asset {}", key);
        } catch (RuntimeException | IOException exception) { log.warn("Could not import base gallery asset {}", file, exception); }
    }

    private String contentType(Path file) {
        String name = file.getFileName().toString().toLowerCase(Locale.ROOT);
        return name.endsWith(".png") ? "image/png" : name.endsWith(".webp") ? "image/webp" : "image/jpeg";
    }
}
