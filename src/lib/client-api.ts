const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const CLIENT_API_BASE = (() => {
  if (configuredApiUrl && !configuredApiUrl.startsWith("/")) {
    return trimTrailingSlash(configuredApiUrl);
  }

  if (configuredBackendUrl) {
    return `${trimTrailingSlash(configuredBackendUrl)}/api/v1`;
  }

  return configuredApiUrl ?? "http://localhost:8081/api/v1";
})();
