# Fix cứng Node.js version 20.18.0 (LTS Bookworm)
FROM node:20.18.0-bookworm

# Cài đặt các công cụ hệ thống cần thiết (Git, SQLite3, openssl cho Prisma)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    sqlite3 \
    libsqlite3-dev \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc mặc định trong Container
WORKDIR /workspace

# Đảm bảo permissions cho user node có sẵn trong image
USER node

EXPOSE 3000