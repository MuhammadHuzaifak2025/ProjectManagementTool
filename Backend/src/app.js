import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import {
  ErrorHandlerMiddleWare,
  ServerErrorMiddleWare,
} from "./middlewares/GlobalError.js";

const app = express();

app.use(
  cors({
    origin: ["https://project-management-tool-oq8ty3azb.vercel.app", "https://project-management-tool-khtm.vercel.app"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "50kb",
  })
);

app.use(express.static("public"));

app.use(cookieparser());

import UserRouter from "./routes/user.routes.js";
import TaskRouter from "./routes/task.routes.js";

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/task", TaskRouter);

app.use(ErrorHandlerMiddleWare);
export default app;
