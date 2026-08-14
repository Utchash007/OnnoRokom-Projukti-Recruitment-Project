# ============================================================
# Stage 1: Build ASP.NET Core Backend
# ============================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

# Copy backend project and restore dependencies
COPY Backend/OnnorokomBackend/OnnoRokomBackend.csproj Backend/OnnorokomBackend/
RUN dotnet restore Backend/OnnorokomBackend/OnnoRokomBackend.csproj

# Copy full backend source and publish
COPY Backend/OnnorokomBackend/ Backend/OnnorokomBackend/
WORKDIR /src/Backend/OnnorokomBackend
RUN dotnet publish OnnoRokomBackend.csproj -c Release -o /app/backend /p:UseAppHost=false

# ============================================================
# Stage 2: Build Next.js 15 Frontend
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy package dependencies and install
COPY Frontend/package.json Frontend/package-lock.json ./
RUN npm ci

# Copy frontend source and build standalone bundle
COPY Frontend/ .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ============================================================
# Stage 3: Unified Production Runtime (Backend + Frontend)
# ============================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runner
WORKDIR /app

# Install Node.js runtime for Next.js
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend published binaries
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend standalone output & assets
COPY --from=frontend-builder /app/public /app/frontend/public
COPY --from=frontend-builder /app/.next/standalone /app/frontend/
COPY --from=frontend-builder /app/.next/static /app/frontend/.next/static

# Copy and setup start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Environment settings
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENV INTERNAL_BACKEND_URL=http://localhost:5000
ENV NEXT_PUBLIC_API_URL=http://localhost:5000
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 5000

CMD ["/app/start.sh"]
