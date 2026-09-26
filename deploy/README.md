# Production deployment verification

Use [production.env.example](production.env.example) as the deployment platform's secret and environment-variable template. It is prefilled with the landing's canonical origin, `https://universmarbre.com`; add an origin only when it is an approved browser client.

## Required deployment settings

- Run the API with `SPRING_PROFILES_ACTIVE=production` and a unique `UNIVMAR_JWT_SECRET` generated from a cryptographic random source.
- Set `UNIVMAR_PUBLIC_API_URL=https://erp.universmarbre.com/api/v1` and `UNIVMAR_CORS_ALLOWED_ORIGINS=https://universmarbre.com`.
- Configure the SMTP values in the environment template and submit a real contact request. Confirm that it appears in the ERP inbox and reaches `UNIVMAR_WEBSITE_EMAIL_TO`.
- Provision an S3 bucket with no public bucket or object-read policy. Give the API identity only the bucket permissions it needs. Do not publish the S3 or MinIO endpoint.
- The repository does not contain a base gallery. Upload catalogue and portfolio images through the ERP, or preload the required media into the private bucket before launch. Existing legacy paths use the `base-gallery/` key prefix and are still served through the ERP image endpoint.
- Put the public API behind the HTTPS-only reverse proxy in [erp.universmarbre.com.conf](nginx/erp.universmarbre.com.conf). The HTTP listener performs a permanent redirect and the HTTPS listener sends forwarded-protocol headers to Spring Boot.
- The Compose stack includes the landing at port `3000`. It uses `http://api:8080/api/v1` only inside the Docker network; set `NEXT_PUBLIC_SITE_URL` to the public HTTPS landing domain.

## Backup and restore drill

Run `verify-backup-restore.sh` with `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, and `PGPASSWORD` set to a non-production maintenance credential. It creates a timestamped temporary database, restores a fresh custom-format dump, verifies Flyway history, then removes the temporary database and dump. Schedule this drill at least quarterly and retain encrypted backups according to the company retention policy.

## Final production checks

1. Run the backend suite and its role matrix.
2. Log in as each role and confirm the protected navigation and mutation routes match the matrix.
3. Attempt a denied mutation, then confirm `GET /api/v1/activity/access-denials` as an administrator contains the actor and route.
4. Request a document URL without a session and confirm a `401`; request it as staff and confirm access.
5. Confirm an object URL from the S3 provider is denied, while an approved public product image loads through `https://erp.universmarbre.com/api/v1/uploads/images/...`.
6. From the landing, submit the contact form with UTM parameters and confirm the stored inquiry and email delivery status.
