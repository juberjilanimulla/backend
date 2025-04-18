import express from "express";
import dbConnect from "./src/config/db.js";
import config from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import postRouter from "./src/routes/postRouter.js";
import { Admin } from "./src/utils/helperFunction.js";
import authRouter from "./src/routes/authRouter.js";

const app = express();
const port = config.PORT;

// app.set("trust proxy", true);
// morgan.token("remote-addr", function (req) {
//   return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
// });

// morgan.token("url", (req) => {
//   const url = new URL(req.url, `http://${req.headers.host}`);
//   return req.originalUrl;
// });

app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON input" });
  }
  next(err);
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

//routing

app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
// not found
// app.use("*", (req, res) => {
//   res.status(403).json({
//     message: "not found",
//   });
// });

//database connection
dbConnect()
  .then(() => {
    Admin();
    app.listen(port, () => {
      console.log(`server is listening at ${port}`);
    });
  })
  .catch((error) => {
    console.log("unable to connected to database", error);
  });
