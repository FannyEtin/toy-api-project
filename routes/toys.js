const express = require("express");
const router = express.Router();
const { ToyModel, validateToy } = require("../models/toyModel");
const auth = require("../middleware/auth");

// route a
/* router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.skip) || 0;
    const pageSize = 10;
    const toys = await ToyModel.find({})
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.json(toys);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Error while trying to get the toys", err });
  }
});
*/

// route b
router.get("/search", async (req, res) => {
  try {
    const search = req.query.s || "";
    const page = Number(req.query.skip) || 0;
    const pageSize = 10;

    const toys = await ToyModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { info: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.json(toys);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Server error, try again later", err });
  }
});

// route a & c
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.skip) || 0;
    const pageSize = 10;
    const category = req.query.cat;

    const filter = {};

    if (category) {
      filter.category = { $regex: category.trim(), $options: "i" };
    }

    const toys = await ToyModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.json(toys);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Error while trying to get the toys from selected category", err });
  }
});

// route d
router.post("/", auth, async (req, res) => {
  try {
    const { error } = validateToy(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: "Invalid data", details: error.details });

    const newToy = new ToyModel({
      ...req.body,
      category: req.body.category.toLowerCase(),
      user_id: req.user._id,
    });

    await newToy.save();
    res.status(201).json(newToy);
  } catch (err) {
        console.error("Toy creation error:", err.message);
        res.status(500).json({ msg: "Server error", error: err.message });

  }
});

// route e
router.put("/:id", auth, async (req, res) => {
  try {
    const toyId = req.params.id;
    const { error } = validateToy(req.body);
    if (error)
      return res
        .status(400)
        .json({ msg: "Invalid data", details: error.details });

    const toy = await ToyModel.findOne({ _id: toyId, user_id: req.user._id });
    if (!toy)
      return res
        .status(404)
        .json({ msg: "Toy not found or you are not authorized" });

    Object.assign(toy, req.body);
    await toy.save();

    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Server error, try again later", err });
  }
});

// route f
router.delete("/:id", auth, async (req, res) => {
  try {
    const toyId = req.params.id;
    const toy = await ToyModel.findOneAndDelete({
      _id: toyId,
      user_id: req.user._id,
    });
    if (!toy)
      return res
        .status(404)
        .json({ msg: "Toy not found or you are not authorized" });

    res.json({ msg: "Toy deleted successfully", toy });
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Server error, try again later", err });
  }
});

// route g
router.get("/prices", async (req, res) => {
  try {
    const page = Number(req.query.skip) || 0;
    const pageSize = 10;

    const minPrice = Number(req.query.min) || 0;
    const maxPrice = Number(req.query.max) || 999999;

    const toys = await ToyModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
    })
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.json(toys);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Server error, try again later", err });
  }
});

// route h
router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const toy = await ToyModel.findOne({ _id: id });
    if (!toy) {
      return res.status(404).json({ msg: "Toy not found" });
    }
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(502).json({ msg: "Server error, try again later", err });
  }
});

// route i
router.get("/count", async (req, res) => {
  try {
    const count = await ToyModel.countDocuments({});
    res.json({ count });
  } catch (err) {
    console.error("Count error:", err.message);
    res.status(502).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;