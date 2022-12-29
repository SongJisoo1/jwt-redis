const createError = require("http-errors");

const { authSchema } = require("../helpers/validation_schema");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt_helper");
const client = require("../helpers/init_redis.js");

const User = require("../models/User.model");

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password } = await authSchema.validateAsync(
                req.body
            );

            const existUser = await User.findOne({ email });

            if (existUser) {
                throw createError(400, `${email} is already been register`);
            }

            const user = new User({ email, password });

            const savedUser = await user.save();

            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);

            res.status(201).json({ accessToken, refreshToken });
        } catch (err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = await authSchema.validateAsync(
                req.body
            );

            const user = await User.findOne({ email });

            if (!user) throw createError.NotFound("user not registered");

            const isMatch = await user.isValidPassword(password);

            if (!isMatch)
                throw createError.Unauthorized("username/password not valid");

            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);

            res.json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);

            const newAccessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefreshToken(userId);
            res.json({ newAccessToken, newRefreshToken });
        } catch (error) {
            next(error);
        }
    },

    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            console.log(refreshToken);
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            client.DEL(userId, (err, value) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError();
                }

                console.log(value);
                res.status(200).json({ message: "로그아웃되었습니다." });
                return;
            });
        } catch (error) {
            next(error);
        }
    },
};
