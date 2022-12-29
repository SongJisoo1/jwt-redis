const Joi = require("@hapi/joi");

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        "string.base": "문자열을 입력해주세요",
        "string.email": "이메일 형식이 아닙니다.",
        "string.empty": "잘못된 입력값입니다.",
    }),
    password: Joi.string().min(2).required().messages({
        "string.base": "문자열을 입력해주세요",
        "string.min": "최소 2자 이상 입력해야 합니다.",
        "string.empty": "잘못된 입력값입니다.",
    }),
});

module.exports = {
    authSchema,
};
