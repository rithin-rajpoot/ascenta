import { config } from "../config/env.js";
import axios from "axios";

export const proxyAiRequest = async (req, res, next, endpoint) => {
  try {
    const aiResponse = await axios.post(`${config.aiServiceUrl}/ai/${endpoint}`, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(aiResponse.data);
  } catch (error) {
    if (error.response) {
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
