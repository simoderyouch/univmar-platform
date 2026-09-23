package com.univmar.common.storage;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorage {
    UploadedImage store(MultipartFile file);

    record UploadedImage(String url, String originalFilename) { }
}
