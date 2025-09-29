const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "USER" },
}, { timestamps: true });

const userModel = mongoose.model("users",userSchema);
exports.UserModel = userModel;

exports.validateUser = (_body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("USER", "ADMIN").optional()
  });
  return schema.validate(_body);
};
