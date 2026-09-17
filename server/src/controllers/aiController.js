import { config } from "../config/env.js";
import axios from "axios";

const isDev = config.nodeEnv !== "production";

// AI generation (plus a possible Render free-tier cold start) can take a
// while — 90s covers cold start + Gemini generation without hanging forever.
const AI_PROXY_TIMEOUT_MS = 90 * 1000;

// Host portion of the AI URL for safe production logging (no secrets).
const aiServiceHost = () => {
  try {
    return new URL(config.aiServiceUrl).host;
  } catch {
    return config.aiServiceUrl;
  }
};

// Render gateway failures come back as full HTML pages — keep just the
// <title> (or a short slice) so logs stay readable.
const summarizeProxyBody = (body) => {
  const text = typeof body === "string" ? body : JSON.stringify(body ?? "");
  const title = /<title>([^<]*)<\/title>/i.exec(text)?.[1]?.trim();
  if (title) return `<title>${title}</title>`;
  return text.slice(0, 300);
};

// True when the failure came from a gateway/proxy (HTML page), not from the
// AI service itself (which always answers JSON, even on errors).
const isGatewayHtml = (response) => {
  const contentType = response.headers?.["content-type"] || "";
  if (contentType.includes("text/html")) return true;
  return (
    [502, 503, 504].includes(response.status) &&
    typeof response.data === "string" &&
    response.data.includes("<!DOCTYPE html>")
  );
};

export const proxyAiRequest = async (req, res, next, endpoint) => {
  try {
    if (isDev) {
      console.log(`[AI Proxy] Calling: ${config.aiServiceUrl}/ai/${endpoint}`);
    } else {
      // Production: log the target host (never the key) so a misconfigured
      // AI_SERVICE_URL is visible in Render logs instead of a bare 502.
      console.log(`[AI Proxy] Calling AI host: ${aiServiceHost()}/ai/${endpoint}`);
    }

    const headers = { "Content-Type": "application/json" };
    // The AI service is internal: prove we're the backend when a key is configured.
    if (config.aiServiceKey) {
      headers["X-Internal-Key"] = config.aiServiceKey;
    }

    const aiResponse = await axios.post(`${config.aiServiceUrl}/ai/${endpoint}`, req.body, {
      headers,
      // Render free-tier services sleep after ~15 min idle, so the first AI
      // call after idle pays a cold start (~30-60s) on top of Gemini
      // generation time. Fail eventually instead of hanging forever — the AI
      // service is warm by then, so a retry almost always succeeds.
      timeout: AI_PROXY_TIMEOUT_MS,
    });

    if (isDev) {
      console.log(`[AI Proxy] Response status:`, aiResponse.status);
    }
    res.status(200).json(aiResponse.data);
  } catch (error) {
    console.error(`[AI Proxy] Error:`, error.message);
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        message: "The AI service is waking up or taking too long. Please try again in a moment.",
      });
    }
    if (error.response) {
      // Truncate HTML gateway pages (e.g. Render 502) to the <title> so the
      // real cause is visible in logs without dumping a whole page.
      console.error(
        `[AI Proxy] Error response:`,
        error.response.status,
        summarizeProxyBody(error.response.data)
      );
      // The AI service itself always answers JSON — an HTML 502/503/504 means a
      // gateway/proxy in front of it failed (common during free-tier cold
      // starts). Answer with the friendly retry message instead of leaking the
      // gateway page to the frontend.
      if (isGatewayHtml(error.response)) {
        return res.status(504).json({
          success: false,
          message: "The AI service is waking up or taking too long. Please try again in a moment.",
        });
      }
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ success: false, message: "Failed to connect to AI service" });
    }
  }
};

export const generateProjectIdeas = (req, res, next) => proxyAiRequest(req, res, next, 'project-ideas');
export const generateProjectFeatures = (req, res, next) => proxyAiRequest(req, res, next, 'project-features');
export const generateProjectSdgs = (req, res, next) => proxyAiRequest(req, res, next, 'project-sdgs');
export const generateProjectBlueprint = (req, res, next) => proxyAiRequest(req, res, next, 'project-blueprint');
export const generateAssistant = (req, res, next) => proxyAiRequest(req, res, next, 'assistant');
