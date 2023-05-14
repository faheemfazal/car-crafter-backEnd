import User from "../../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import Car from '../../models/hostCar.js'
import CarDb from "../../models/hostCar.js";
import LocationDb from "../../models/locatin.js";
import orderDb from "../../models/orderSchema.js";

export const adminLogin = async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.body.email });

    if (admin && admin.isAdimin) {
      await bcrypt.compare(req.body.password, admin.password, (err, data) => {
        if (err) throw err;
        else {
          const name = admin.name;
          const email = admin.email;
          const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
            expiresIn: 86400,
          });
          res
            .status(200)
            .json({
              admin: true,
              name,
              email,
              message: "Login success",
              token,
            });
        }
      });
    } else {
      res.status(204).json({ message: "check your userId" });
    }
  } catch {}
};

export const getHostData = async (req, res) => {
  try {
    const car = await CarDb.find({ status: "pending" });

    if (car) {
      res.status(200).json({ message: "Success", car });
    } else {
    }
  } catch (e) {}
};

export const approveHost = async (req, res) => {
  try {
    const car = await CarDb.updateOne(
      {
        _id: req.query.id,
      },
      {
        status: "Approved",
      }
    );

    res.status(200).json({ message: "Rc approved" });
  } catch (e) {}
};

export const denildHost = (req, res) => {
  try {
  } catch (e) {}
};

export const getVerifyData = async (req, res) => {
  try {
    const car = await CarDb.find({ status: req.query.status });

    res.status(200).json({ message: "Success", car });
  } catch (e) {}
};

export const getLocation = async (req, res) => {
  try {
    const hostcityAndStateCode = await CarDb.aggregate([
      { $group: { _id: { state: "$state", city: "$city" } } },
    ]);

    const oldLocation = await LocationDb.find();

    res.status(200).json({ hostcityAndStateCode, oldLocation });
  } catch (e) {}
};

export const createLocation = async (req, res) => {
  try {
    const location = await LocationDb.findOne({
      state: req.body.state,
      city: req.body.city,
    });

    if (location) {
      res.status(400).json({ message: "already created this city" });
    } else {
      await LocationDb.create(req.body).then((response) => {
        res.status(200).json({ message: " New Location Created" });
      });
    }
  } catch (e) {}
};

export const deleteLocation = async (req, res) => {
  try {
    await LocationDb.findByIdAndDelete(req.query.id)
      .then((response) => {
        res.status(201).json({ message: "successfully deleted" });
      })
      .catch((er) => {
        res.status(501).json({ message: "somthing wrong" });
      });
  } catch (e) {}
};

export const getOrderDetails = async (req, res) => {
  try {
    const data = await orderDb.find({});

    res.status(201).json(data);
  } catch (e) {}
};

export const getCompliteOrder = async (req, res) => {
  try {
    const orders = await orderDb.find({ orderStatus: "complete" });

    res.status(201).json({ orders });
  } catch (e) {}
};

export const getAcDetails = async (req, res) => {
  try {
    const acDetail = await CarDb.findOne({ _id: req.query.userId }).populate(
      "owner"
    );

    if (acDetail)
      return res
        .status(201)
        .json({
          account: acDetail.owner.bankAccount,
          amount: req.query.amount,
        });
    return res.json({ msg: "Create your account" });
  } catch (e) {}
};

export const updatePayment = async (req, res) => {
  try {
    const data = await orderDb.findOneAndUpdate(
      { _id: req.body.orderId },
      { orderStatus: "complete Payment" },
      { new: true }
    );

    res.status(201).json({ data });

    if (data) return res.status(201).json({ data });
    return res.json({});
  } catch (e) {}
};

export const getUserDetails = async (req, res) => {
  try {
    const users = await User.find();

    if (users) return res.status(201).json({ users });
    return res.json({});
  } catch (e) {}
};

export const blockUser = async (req, res) => {
  try {
    await User.updateOne({ _id: req.query.userId }, { access: false })
      .then((response) => {
        res.status(201).json();
      })
      .catch((err) => {
        res.status(501).json();
      });
  } catch {}
};

export const UnblockUser = async (req, res) => {
  try {
    await User.updateOne({ _id: req.query.userId }, { access: true })
      .then((response) => {
        res.status(201).json();
      })
      .catch((err) => {
        res.status(501).json();
      });
  } catch {}
};
const getMonthName = (monthNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
};

export const getDashBord = async (req, res) => {
  try {
    const profit = await orderDb.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%m", date: "$createdAt" } },
          profit_count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = profit.map((report) => {
      const month = getMonthName(report._id);
      report.month = month;
      return report;
    });
    const pending = await orderDb.find({ orderStatus: "pending" }).count();
    const complete = await orderDb.find({ orderStatus: "complete" }).count();
    const cancel = await orderDb.find({ orderStatus: "cancel" }).count();
    const completePayment = await orderDb
      .find({ orderStatus: "complete Payment" })
      .count();
    console.log(pending);
    let data = [];
    data.push(pending);
    data.push(complete);

    data.push(cancel);
    data.push(completePayment);

    res.status(200).json({ result, data });
  } catch (err) {
    // res.status(500).json({ error:"internal server error" });
  }
};
 