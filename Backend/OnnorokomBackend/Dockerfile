# ==========================================
# Stage 1: Base Runtime Environment
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# ==========================================
# Stage 2: SDK & Build
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore dependencies (layer caching)
COPY ["OnnoRokomBackend.csproj", "./"]
RUN dotnet restore "OnnoRokomBackend.csproj"

# Copy remaining source code and build
COPY . .
RUN dotnet build "OnnoRokomBackend.csproj" -c Release -o /app/build

# ==========================================
# Stage 3: Publish App
# ==========================================
FROM build AS publish
RUN dotnet publish "OnnoRokomBackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# Stage 4: Minimal Final Runtime
# ==========================================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Run as non-root user for container security
USER $APP_UID

ENTRYPOINT ["dotnet", "OnnoRokomBackend.dll"]
