const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");

const client = require("./helpers/init_redis");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const AuthRoute = require("./Routes/Auth.route");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", verifyAccessToken, async (req, res, next) => {
    console.log(req.headers["authorization"]);
    res.status(200).json({ status: "ok" });
});

app.use("/auth", AuthRoute);

app.use((req, res, next) => {
    next(createError.NotFound("This route does not exist"));
});

app.use((error, req, res, next) => {
    res.status(error.status || 400);
    res.json({
        status: error.status || 400,
        message: error.message,
    });
});

app.listen(app.get("port"), () => {
    console.log("Server running on port 3000");
});
