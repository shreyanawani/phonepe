const express = require("express");
let app = express();
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const uuid = require("uuid");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const config = require("./config");
const {
  db: { group, password, name },
} = config;
const port = config.app.port;
const userModel = require("./model");
const offerModel = require("./offer_model");
const DB = `mongodb+srv://${name}:${password}@${group}.vxw1w.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(DB)
  .then(() => {
    useNewUrlParser: true;
    useCreateIndex: true;
    useUnifiedTopology: true;
    useFindAndModify: false;
    console.log("connection successful");
  })
  .catch((err) => console.log("no connection"));

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/pitches/:id/makeOffer", function (req, res) {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["investor", "equity", "amount", "comment"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    let f = true;
    for (const k in allowedUpdates) {
      if (!updates.hasOwnProperty(k)) {
        f = false;
        break;
      }
    }
    if (!isValidOperation || f == false) {
      return res.status(400).send("Invalid Request Body");
    }
    userModel.find({ id: req.params.id }, function (err, result) {
      if (err || result.length == 0) {
        return res.status(404).send("Pitch Not Found");
      } else {
        // let offer = {};
        // offer.id = req.params.id;
        // req.body.id = id;
        const offer = new offerModel(req.body);
        offer.id = req.params.id;
        console.log(offer);
        console.log(typeof offer);
        const update = {
          $push: { offers: offer },
        };
        const options = { upsert: true };

        userModel.findOneAndUpdate(
          req.params.id,
          update,
          options,
          function (err, data) {
            if (err) {
              return res.status(500).send(err);
            }
            if (!data) {
              return res.status(404).send("Pitch Not Found");
            }
          }
        );
        offer.save();
        return res.status(201).json({ id: req.params.id });
      }
    });
  } catch (e) {
    console.log("err");
    return res.status(400).send("Invalid Request Body");
  }
});

app.post("/pitches", function (req, res) {
  try {
    console.log("f");
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "entrepreneur",
      "pitchTitle",
      "pitchIdea",
      "askAmount",
      "equity",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    let f = true;
    for (const k in allowedUpdates) {
      if (!updates.hasOwnProperty(k)) {
        f = false;
        break;
      }
    }
    if (!isValidOperation || f == false) {
      console.log("gg");
      return res.status(400).send("Invalid Request Body");
    }
    req.body.id = uuid.v4();
    const user = new userModel(req.body);
    user.save();
    return res.status(201).json({ id: req.body.id });
  } catch (e) {
    return res.status(400).send("Invalid Request Body");
  }
});

app.get("/pitches/:id", function (req, res) {
  userModel.find(
    { id: req.params.id },
    { _id: 0, __v: 0, offers: { _id: 0 } },
    function (err, docs) {
      if (err || docs.length == 0) {
        // console.log(err);
        return res.status(404).send("Pitch Not Found");
      } else {
        return res.json(docs);
      }
    }
  );
});

app.get("/pitches", function (req, res) {
  userModel.find(
    {},
    { _id: 0, __v: 0, offers: { _id: 0 } },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        return res.json(result);
      }
    }
  );
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./form.html"));
});

app.listen(port, () => {
  console.log("im listening");
});
