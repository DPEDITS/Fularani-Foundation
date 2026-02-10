import { Router } from "express";
import { createDonation, getActiveSubscriptions, cancelSubscription } from "../controllers/donation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const donationRouter = Router();

donationRouter.route("/create").post(createDonation);
donationRouter.route("/active-subscriptions").get(verifyJWT, getActiveSubscriptions);
donationRouter.route("/cancel-subscription/:subscriptionId").patch(verifyJWT, cancelSubscription);

export default donationRouter;
