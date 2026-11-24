#!/usr/bin/env bash
# Load local mail settings without executing the contents of .env.
mail_env_file="$project_root/.env"
if [ -f "$mail_env_file" ]; then
  while IFS='=' read -r mail_key mail_value || [ -n "$mail_key" ]; do
    case "$mail_key" in
      UNIVMAR_QUOTATION_EMAIL_ENABLED|UNIVMAR_QUOTATION_EMAIL_FROM|SPRING_MAIL_HOST|SPRING_MAIL_PORT|SPRING_MAIL_USERNAME|SPRING_MAIL_PASSWORD|SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH|SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE)
        # Explicit shell environment variables take precedence over .env.
        if [ -z "${!mail_key+x}" ]; then
          export "$mail_key=$mail_value"
        fi
        ;;
    esac
  done < "$mail_env_file"
fi
