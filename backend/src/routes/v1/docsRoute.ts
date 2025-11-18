import { Router } from "express";
import type { RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDocs from "swagger-jsdoc";
import { swaggerOption } from "../../config/option";

const swaggerSpec = swaggerJSDocs(swaggerOption);
const docsRouter = Router();

// Serve swagger UI and setup with the generated spec
docsRouter.use(
	"/",
	swaggerUi.serve as unknown as RequestHandler,
	swaggerUi.setup(swaggerSpec) as unknown as RequestHandler
);

export default docsRouter;
