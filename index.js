const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const uri =
  "mongodb+srv://ababilit:bYpBAUmDZ4sGf8Y@cluster0.dmtd1.mongodb.net/vaccineData?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();

app.use(bodyParser.json());
app.use(cors());

client.connect((err) => {
  const vaccineCollection = client.db("vaccineData").collection("vaccine");
  const adminCollection = client.db("vaccineData").collection("admin");

  app.get("/", (req, res) => {
    res.send("Database Conncected");
  });

  app.get("/vaccine", (req, res) => {
    vaccineCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/vaccineforuser/:id", (req, res) => {
    const id = req.params.id;
    vaccineCollection.find({ user: id }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/singlevaccine/:id", (req, res) => {
    const id = req.params.id;
    vaccineCollection.find({ certificateNo: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.get("/vaccineverify/:id", (req, res) => {
    const id = req.params.id;
    vaccineCollection.find({ vaccineId: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.get("/adminList", (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/newvaccine", (req, res) => {
    const vaccine = req.body;
    const { user } = vaccine;

    adminCollection.find({ _id: ObjectId(user) }).toArray((err, document) => {
      if (document[0].enable) {
        const cerNo = document[0].totalCer;

        const total = parseInt(cerNo) + 1;

        vaccineCollection.insertOne(vaccine).then((err, resutl) => {
          adminCollection.updateOne(
            { _id: ObjectId(user) },
            { $set: { totalCer: total } }
          );
          res.send({ msg: "success", result: resutl });
        });
      } else {
        res.send({ msg: "failed" });
      }
    });
  });

  app.post("/newadmin", (req, res) => {
    const { name, email, customerPassword, totalCer, enable } = req.body;
    const user = req.body.password;
    if (user === "Murshed@@@k5") {
      adminCollection
        .insertOne({ name, email, customerPassword, totalCer, enable })
        .then((error, resutl) => {
          res.send({
            msg: "success",
            resutl,
          });
        });
    } else {
      res.send({ msg: "You Ar Not Allow to add" });
    }
  });

  app.post("/login", (req, res) => {
    const admin = req.body;

    adminCollection
      .find({ email: admin.email, customerPassword: admin.customerPassword })
      .toArray((err, document) => {
        if (document.length) {
          res.send({
            msg: "userFound",
            data: document[0],
          });
        } else {
          res.send({
            msg: "userNotFound",
          });
        }
      });
  });

  app.get("/disable/:id", (req, res) => {
    const id = req.params.id;
    adminCollection.find({ _id: ObjectId(id) }).toArray((err, documents) => {
      if (documents.length) {
        adminCollection
          .updateOne({ _id: ObjectId(id) }, { $set: { enable: false } })
          .then((err, document) => {
            res.send({ document, msg: "success" });
          });
      } else {
        res.send({
          msg: "failed",
        });
      }
    });
  });

  app.get("/enable/:id", (req, res) => {
    const id = req.params.id;
    adminCollection.find({ _id: ObjectId(id) }).toArray((err, documents) => {
      if (documents.length) {
        adminCollection
          .updateOne({ _id: ObjectId(id) }, { $set: { enable: true } })
          .then((err, document) => {
            res.send({ document, msg: "success" });
          });
      } else {
        res.send({
          msg: "failed",
        });
      }
    });
  });

  console.log("connected");

  // client.close();
});

app.listen(process.env.PORT || 5000);
