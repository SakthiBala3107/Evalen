import { Router } from "express";
import { getStreamToken } from "../controllers/chatRoutes.controller.js";
import { ProtectRoute } from "../middlewares/protectRoute.js";

const chatRouter = Router();

chatRouter.get("/token", ProtectRoute, getStreamToken);

export default chatRouter;
