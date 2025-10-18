import {Router} from "express";
import {getUser, getUsers, createUser, updateUserById, deleteUserById} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.post("/", createUser);
userRouter.put("/:id", authorize, updateUserById);
userRouter.delete("/:id", authorize, deleteUserById);

export default userRouter;