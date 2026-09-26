package com.univmar.common.storage;

import com.univmar.common.api.ApiException;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
@ConditionalOnProperty(name = "univmar.storage.provider", havingValue = "s3")
public class S3ImageStorage implements ImageStorage {
    private static final Map<String, String> EXTENSIONS = Map.of("image/jpeg", "jpg", "image/png", "png", "image/webp", "webp");
    private static final Pattern STORED_FILENAME = Pattern.compile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png|webp)$", Pattern.CASE_INSENSITIVE);
    private final S3Client client;
    private final String bucket;
    private final String publicApiUrl;

    public S3ImageStorage(@Value("${univmar.storage.s3.endpoint}") String endpoint,
                          @Value("${univmar.storage.s3.region}") String region,
                          @Value("${univmar.storage.s3.bucket}") String bucket,
                          @Value("${univmar.storage.s3.access-key}") String accessKey,
                          @Value("${univmar.storage.s3.secret-key}") String secretKey,
                          @Value("${univmar.storage.public-api-url}") String publicApiUrl) {
        this.bucket = bucket;
        this.publicApiUrl = publicApiUrl.replaceAll("/$", "");
        this.client = S3Client.builder().endpointOverride(URI.create(endpoint)).region(Region.of(region))
                .forcePathStyle(true).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))).build();
        ensureBucket();
    }

    @Override
    public UploadedImage store(MultipartFile file) {
        if (file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "Select an image to upload.");
        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        String extension = EXTENSIONS.get(contentType);
        if (extension == null) throw new ApiException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_IMAGE", "Only JPEG, PNG, and WebP images are accepted.");
        String key = "uploads/images/" + UUID.randomUUID() + "." + extension;
        try {
            client.putObject(PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(), RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return new UploadedImage(publicApiUrl + "/uploads/images/" + key.substring("uploads/images/".length()), file.getOriginalFilename());
        } catch (IOException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "UPLOAD_FAILED", "The image could not be stored.");
        }
    }

    public void importFile(Path file, String key, String contentType) {
        try {
            client.putObject(PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(), RequestBody.fromFile(file));
        } catch (RuntimeException exception) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "GALLERY_IMPORT_FAILED", "The base gallery could not be uploaded.");
        }
    }

    public boolean exists(String key) {
        try { client.headObject(builder -> builder.bucket(bucket).key(key)); return true; }
        catch (RuntimeException exception) { return false; }
    }

    @Override
    public StoredImage load(String filename) {
        if (filename == null || !STORED_FILENAME.matcher(filename).matches()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        }
        return loadKey("uploads/images/" + filename, filename);
    }

    /** Reads an imported base-gallery object without exposing its MinIO URL. */
    public StoredImage loadBaseGallery(String relativePath) {
        String safePath = relativePath == null ? "" : relativePath.replace('\\', '/');
        if (safePath.isBlank() || safePath.startsWith("/") || safePath.contains("..") || !safePath.matches(".+\\.(?i:jpg|jpeg|png|webp)$")) {
            throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
        }
        return loadKey("base-gallery/" + safePath, safePath);
    }

    private StoredImage loadKey(String key, String filename) {
        try {
            var response = client.getObject(GetObjectRequest.builder().bucket(bucket).key(key).build());
            String contentType = response.response().contentType();
            return new StoredImage(response, contentType == null || contentType.isBlank() ? contentType(filename) : contentType);
        } catch (S3Exception exception) {
            if (exception.statusCode() == 404) throw new ApiException(HttpStatus.NOT_FOUND, "IMAGE_NOT_FOUND", "The image was not found.");
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "IMAGE_READ_FAILED", "The image could not be read.");
        }
    }

    private String contentType(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        return lower.endsWith(".png") ? "image/png" : lower.endsWith(".webp") ? "image/webp" : "image/jpeg";
    }

    private void ensureBucket() {
        try { client.headBucket(HeadBucketRequest.builder().bucket(bucket).build()); }
        catch (NoSuchBucketException exception) { client.createBucket(CreateBucketRequest.builder().bucket(bucket).build()); }
    }
}
