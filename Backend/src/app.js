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
    origin: [
      "https://projectmanagementtool-lzok.onrender.com",
      "https://projectmanagementtool-2.onrender.com",
      "https://project-management-tool-pi.vercel.app",
      "https://project-management-tool-khtm.vercel.app",
      "http://localhost:5173",
      "http://localhost:5001",
    ],
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
