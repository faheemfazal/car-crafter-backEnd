import CarDb from "../../models/hostCar.js";
import Cardb from "../../models/hostCar.js";
import LocationDb from "../../models/locatin.js";
import userDb from "../../models/userSchema.js";
import orderDb from "../../models/orderSchema.js";
import messageDb from "../../models/messageSchema.js";
import mongoose from "mongoose";

export const hostData = async (req, res) => {
  try {
    const data = req.body;
    const exist = await Cardb.findOne({ carNumber: req.body.carNumber });

    if (exist) {
      res.status(400).json({ message: "already stored" });
    } else {
      Object.assign(req.body);
      const car = await Cardb.create(req.body);
      res.status(201).json({ car, message: "Success" });
    }
  } catch (e) {}
};

export const getLocation = async (req, res) => {
  try {
    const city = await LocationDb.find({}, { city: 1 }).sort({ city: 1 });

    res.status(201).json({ city });
  } catch (e) {}
};

export const hostList = async (req, res) => {
  try {
    const Approved = await Cardb.find({
      owner: req.userId,
      status: "Approved",
    });

    // const Orders = await orderDb.find({userData:req.query.id}).populate('carData')
    await orderDb
      .aggregate([
        {
          $lookup: {
            from: "cardbs",
            localField: "carData",
            foreignField: "_id",
            as: "hosterDetails",
          },
        },
        {
          $unwind: "$hosterDetails",
        },
        {
          $match: {
            "hosterDetails.owner": new mongoose.Types.ObjectId(req.userId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userData",
            foreignField: "_id",
            as: "ownerDetails",
          },
        },
        {
          $unwind: "$ownerDetails",
        },
      ])
      .then((Orders) => {
        res.status(201).json({ Approved, Orders });
      })
      .catch((err) => {});
  } catch (err) {}
};

export const postAccountdetails = async (req, res) => {
  try {
    const newAccount = await userDb.findOneAndUpdate(
      { _id: req.userId },
      {
        bankAccount: req.body,
      },
      { upsert: true },
      { new: true }
    );

    res.status(201).json({ newAccount: newAccount });
  } catch (e) {}
};

export const getAccount = async (req, res) => {
  try {
    console.log(req.userId);
    const oldAccount = await userDb.findOne({
      _id: req.userId,
      bankAccount: { $exists: true },
    });

    if (oldAccount) {
      res.status(201).json({ oldAccount });
    } else {
      res.status(502);
    }
  } catch {}
};

export const addMesssage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageDb.create({
      message: { text: message },
      users: { from, to },
      sender: from,
    });
    if (data)
      return res.status(201).json({ msg: "Message added successfully" });
    return res.json({ msg: "faild to add message in datebase" });
  } catch (e) {}
};

export const completeOrder = async (req, res) => {
  try {
    const data = await orderDb.findOneAndUpdate(
      { _id: req.body.orderId },
      { orderStatus: "complete" },
      { new: true }
    );

    res.status(201).json({ data });

    if (data) return res.status(201).json({ data });
    return res.json({});
  } catch (e) {}
};

export const checkAcc = async (req, res) => {
  try {
    const user = await userDb.findOne({
      _id: req.query.userId,
      bankAccount: { $exists: true },
    });

    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(501).json({});
    }
  } catch {}
};
