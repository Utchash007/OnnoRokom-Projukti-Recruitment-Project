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
COPY Frontend/package.json Frontend/package-lock.json* ./
RUN npm install

# Copy frontend source and build standalone bundle
COPY Frontend/ .
RUN mkdir -p public
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

# Environment settings (Strictly separate internal backend port 5000 from public frontend port)
ENV ASPNETCORE_URLS=http://127.0.0.1:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENV INTERNAL_BACKEND_URL=http://127.0.0.1:5000
ENV NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000 3000 5000

# Direct inline command: runs backend on internal port 5000 and Next.js frontend on public PORT (10000)
CMD ["/bin/bash", "-c", "cd /app/backend && ASPNETCORE_URLS=http://127.0.0.1:5000 dotnet OnnoRokomBackend.dll & cd /app/frontend && PORT=${PORT:-10000} node server.js"]
