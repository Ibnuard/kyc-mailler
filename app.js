const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { httpRes } = require("./utils/responder");
const nodemailer = require("nodemailer");

dotenv.config();

// routes source
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.set("trust proxy", true);
app.disable("etag");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, OPTION, DELETE"
  );
  next();
});

app.post("/confirmationkyc", (req, res) => {
  const REQUEST_BODY = req?.body;

  // == SEND EMAIL
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.EMAIL_SENDER,
    to: process.env.EMAIL_RECEIVER,
    subject: "ZIPAY KYC",
    text: `Permintaan KYC dari nomor ${REQUEST_BODY.phoneNumber}`,
  };

  transporter.sendMail(options, (error, info) => {
    if (!error) {
      let resp = httpRes(
        res.statusCode,
        "Success",
        "KYC Confirmation Success!"
      );
      res.status(200).json(resp);
    } else {
      let resp = httpRes(400, "Error", "Service error please try again!");
      res.status(400).json(resp);
    }
  });
});

app.get("/", (req, res) => {
  let resp = httpRes(res.statusCode, "Success", {
    test: "Hello World",
  });
  res.status(200).json(resp);
});

// error handler
app.use((req, res, next) => {
  return res.status(404).json({ status: 404, error: "Not found" });
});
app.use((error, req, res, next) => {
  return res.status(500).json({ status: 500, error: error.toString() });
});

// serve
app.listen(process.env.PORT, () => {
  console.log("info", `SERVER IS RUNNING ON ${process.env.PORT}`);
});
