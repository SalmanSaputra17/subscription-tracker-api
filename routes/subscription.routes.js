import {Router} from "express";
import {
    createSubscription,
    getUserSubscriptions,
    getSubscriptions,
    getSubscriptionById,
    updateSubscriptionById,
    deleteSubscriptionById,
    cancelSubscriptionById,
    getUpcomingRenewals
} from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getSubscriptions);
subscriptionRouter.get("/:id", authorize, getSubscriptionById);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscriptionById);
subscriptionRouter.delete("/:id", authorize, deleteSubscriptionById);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscriptionById);
subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

export default subscriptionRouter;