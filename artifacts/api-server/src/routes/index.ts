import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import blogRouter from "./blog";
import servicesRouter from "./services";
import messagesRouter from "./messages";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(blogRouter);
router.use(servicesRouter);
router.use(messagesRouter);
router.use(adminRouter);

export default router;
