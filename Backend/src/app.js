import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import {
  ErrorHandlerMiddleWare,
  ServerErrorMiddleWare,
} from "./middlewares/globalerror.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5001",
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

app.use("/api/v1/user", UserRouter);

app.use(ErrorHandlerMiddleWare);
export default app;
