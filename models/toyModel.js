const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({
  name: { type: String, required: true },
  info: { type: String, required: true },
  category: { type: String, required: true },
  img_url: { type: String, default: "" },
  price: { type: Number, required: true },
  user_id: { type: String, required: true }, 
}, { timestamps: true });

const toyModel = mongoose.model("toys",toySchema);
exports.ToyModel = toyModel;

exports.validateToy = (_body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    info: Joi.string().min(2).max(500).required(),
    category: Joi.string().min(2).max(100).required(),
    img_url: Joi.string().uri().required(),
    price: Joi.number().min(1).max(10000).required()
  });
  return schema.validate(_body);
};
