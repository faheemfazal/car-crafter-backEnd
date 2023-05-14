import mongoose from "mongoose";
import CarDb from "../../models/hostCar.js";
import orderDb from "../../models/orderSchema.js";
import moment from "moment";
import userDb from "../../models/userSchema.js";
import converSationDb from "../../models/converSation.js";
// import messageDb from "../../../user/src/adminScreens/message.js/index.js";
import messageDb from "../../models/messageSchema.js";
import { login } from "../auth/auth.controller.js";

export const getsutableLocation = async (req, res) => {
  try {
    const sutablelocation = await CarDb.find({
      city: req.query.location,
      status: "Approved",
    }).limit(5);

    if (sutablelocation) {
      res.status(201).json({ sutablelocation });
    } else {
      res.status(400).json({ messege: "location is not find" });
    }
  } catch (e) {}
};

export const getfindCar = async (req, res) => {
  try {
    const car = await CarDb.find({
      $and: [
        { city: req.query.location },
        { selectedDate: { $lt: req.query.date } },
      ],
    });

    if (car.length != 0) {
      res.status(201).json({ car });
    } else {
      res
        .status(404)
        .json({ messege: "not avilable car. please sellect defrent location" });
    }
  } catch (e) {}
};

export const getcarDetails = async (req, res) => {
  try {
    const car = await CarDb.findOne({ _id: req.query.id }).populate("owner");

    let amount;

    const startDate = new Date(req.query.date);
    const endDate = new Date(req.query.endDate);

    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    const hours = diffInMilliseconds / (1000 * 60 * 60);

    amount = Math.round(car.price * hours);

    if (car) {
      res.status(201).json({ car, amount });
    } else {
      res.status(404);
    }
  } catch (e) {}
};

export const createOrder = async (req, res) => {
  try {
    const car = await CarDb.findOne({ _id: req.body.carData });

    const startDate = new Date(req.body.date);
    const endDate = new Date(req.body.endDate);

    if (car.selectedDate < startDate) {
      Object.assign(req.body, { endDate, startDate });
      await orderDb
        .create(req.body)
        .then(async (response) => {
          const lastDate = moment(endDate).add(5, "hours");

          const dateUpdate = await CarDb.updateOne(
            { _id: req.body.carData },
            {
              $set: {
                selectedDate: lastDate,
              },
            }
          );

          res.status(202).json({ status: "success", response });
        })
        .catch((er) => {});
    } else {
      res.status(409).json({ messege: "this car already booked" });
    }
  } catch (e) {}
};

// export const updateProfile = async (req, res) => {
//   try {
//   } catch (e) {}
// };

export const orderDetails = async (req, res) => {
  try {
    const orders = await orderDb
      .find({ userData: req.query.id })
      .populate("carData");

    res.status(201).json({ orders });
  } catch (e) {}
};

export const cancelOrder = async (req, res) => {
  try {
    const nowdate = new Date();
    const cancelDate = new Date(req.body.startDate);

    const diffInMs = nowdate - cancelDate;
    const diffInMinutes = Math.floor(diffInMs / 60000);

    let cancelAmount;

    if (30 > diffInMinutes) {
      cancelAmount = req.body.amount;
    } else if (120 > diffInMinutes) {
      cancelAmount = req.body.amount / 2;
    } else {
      cancelAmount = 0;
    }

    await orderDb
      .updateOne({ _id: req.body.orderId }, { orderStatus: "cancel" })
      .then(async (response) => {
        await userDb
          .updateOne(
            { _id: req.body.userId },
            {
              $inc: {
                wallet: cancelAmount,
              },
            }
          )
          .then((response) => {
            res.status(201).json({ messege: "cancel complite" });
          });
      });
  } catch (e) {}
};

export const expandDate = async (req, res) => {
  try {
    const date = new Date(req.body.endDate);

    const endDate = new Date(
      date.getTime() + req.body.expandHoures * 60 * 60 * 1000
    );

    await orderDb
      .findOneAndUpdate(
        { _id: req.body.orderId },
        { $set: { endDate: endDate } },
        { new: true }
      )
      .then((response) => {
        res.status(201).json({ messege: "sucessfully complited" });
      })
      .catch((err) => {});
  } catch (err) {}
};

export const createChat = async (req, res) => {
  try {
    const { senderUserId, reciverId } = req.body;
    const converSation = await converSationDb.findOne({
      members: {
        $all: [senderUserId, reciverId],
      },
    });

    if (!converSation) {
      const newConverSation = new converSationDb({
        members: [senderUserId, reciverId],
      });
      const saveConverSation = await newConverSation.save();

      res.status(200).json({ saveConverSation });
    } else {
      res.status(200).json({ message: "Conversation already created" });
    }
  } catch (e) {}
};

export const getChatList = async (req, res) => {
  try {
    // const chatlist = await converSationDb.find({members:{$in : req.query.userId}}).populate('members')
    const chatlist = await converSationDb.aggregate([
      {
        $match: {
          $expr: {
            $in: [new mongoose.Types.ObjectId(req.query.userId), "$members"],
          },
        },
      },

      { $unwind: { path: "$members" } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memdersData",
        },
      },
      { $project: { memdersData: 1 } },
    ]);

    res.status(200).json({ chatlist });
  } catch (e) {}
};

export const createMessage = async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    const newMessage = new messageDb({
      conversationId,
      sender,
      text,
    });

    try {
      const savedMessage = await newMessage.save();

      res.status(200).json({ savedMessage });
    } catch (error) {
      res.status(500).json({ error: "internal servor error" });
    }
  } catch (e) {}
};
export const getOldMessage = async (req, res) => {
  try {
    const messages = await messageDb.find({
      conversationId: req.query.converSation,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "internal servor error" });
  }
};

export const postProfile = async (req, res) => {
  try {
    console.log(req.body);
    const newAccount = await userDb.findOneAndUpdate(
      { _id: req.body.userId },
      {
        profile: req.body,
      },
      { upsert: true },
      { new: true }
    );

    if (newAccount) return res.status(201).json({ newAccount });
    return res.json({});
  } catch {}
};

export const checkprofile = async (req, res) => {
  try {
    const user = await userDb.findOne({
      _id: req.query.userId,
      profile: { $exists: true },
    });

    if (user) return res.status(201).json({ user });
    return res.status(501).json();
  } catch {}
};
