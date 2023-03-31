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
    vaccineCollection
      .find({ confirmAddmission: true })
      .toArray((err, documents) => {
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
    adminCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/newvaccine", (req, res) => {
    const vaccine = req.body;
    vaccineCollection.insertOne(vaccine).then((err, resutl) => {
      res.send({
        msg: "success",
        resutl,
      });
      // if (err) {
      //   res.send({
      //     msg: "failed",
      //     result: err,
      //   });
      // } else {
      //   res.send({
      //     msg: "success",
      //     resutl,
      //   });
      // }
    });
  });

  app.post("/newadmin", (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin).then((resutl) => {
      res.send(resutl);
    });
  });

  app.post("/admin/login", (req, res) => {
    const admin = req.body;
    adminCollection
      .find({ email: admin.email, password: admin.password })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  console.log("connected");

  // client.close();
});

app.listen(process.env.PORT || 5000);
