import { Router } from "express";
import { ProtectRoute } from "../middlewares/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSession,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionRoutes.contorller.js";

const sessionRouter = Router();

sessionRouter.get("/", ProtectRoute, createSession);
sessionRouter.get("/active", ProtectRoute, getActiveSession);
sessionRouter.get("/my-recent", ProtectRoute, getMyRecentSessions);
sessionRouter.get("/:id", ProtectRoute, getSessionById);

// [POST]
sessionRouter.post("/:id/join", ProtectRoute, joinSession);
sessionRouter.post("/:id/end", ProtectRoute, endSession);
export default sessionRouter;
