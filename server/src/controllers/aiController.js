import { config } from "../config/env.js";
import axios from "axios";

export const proxyAiRequest = async (req, res, next, endpoint) => {
  try {
    console.log(`[AI Proxy] Calling: ${config.aiServiceUrl}/ai/${endpoint}`);
    console.log(`[AI Proxy] Request body:`, JSON.stringify(req.body));
    const aiResponse = await axios.post(`${config.aiServiceUrl}/ai/${endpoint}`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`[AI Proxy] Response status:`, aiResponse.status);
    console.log(`[AI Proxy] Response data:`, JSON.stringify(aiResponse.data).substring(0, 500));
    res.status(200).json(aiResponse.data);
  } catch (error) {
    console.error(`[AI Proxy] Error:`, error.message);
    if (error.response) {
      console.error(`[AI Proxy] Error response:`, error.response.status, error.response.data);
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
