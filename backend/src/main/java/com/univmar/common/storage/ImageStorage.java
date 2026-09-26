package com.univmar.common.storage;

import java.io.InputStream;
import org.springframework.web.multipart.MultipartFile;

public interface ImageStorage {
    UploadedImage store(MultipartFile file);

    /**
     * Loads a generated image through the ERP. Object storage credentials and
     * object URLs therefore never need to be exposed to a browser.
     */
    StoredImage load(String filename);

    record UploadedImage(String url, String originalFilename) { }

    record StoredImage(InputStream content, String contentType) { }
}
