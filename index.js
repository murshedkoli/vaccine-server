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
    const email = req.params.id;
    vaccineCollection.find({ email: email }).toArray((err, documents) => {
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

  // app.get("/loginverify/:id", (req, res) => {
  //   const email = req.params.id;
  //   adminCollection.find({ email: email }).toArray((err, documents) => {
  //     if (documents.length) {
  //       res.send({
  //         msg: "userFound",
  //         data: documents[0],
  //       });
  //     } else {
  //       res.send({
  //         msg: "userNotFound",
  //       });
  //     }
  //   });
  // });

  app.get("/adminList", (req, res) => {
    adminCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/newvaccine", (req, res) => {
    const vaccine = req.body;

    // if (vaccine.email === "demo@demo.com") {
    //   const data = {
    //     name: "demoName",
    //     certificateNo: vaccine.certificateNo,
    //     chooseOne: vaccine.chooseOne,
    //     nid: vaccine.nid,
    //     birthNo: vaccine.birthNo,
    //     passportNo: vaccine.passportNo,
    //     nationality: vaccine.nationality,
    //     birthDate: vaccine.birthDate,
    //     gender: vaccine.gender,
    //     vaccinationBy: vaccine.vaccinationBy,
    //     firstDoes: vaccine.firstDoes,
    //     firstDoesName: vaccine.firstDoesName,
    //     secondDoes: vaccine.secondDoes,
    //     secondDoesName: vaccine.secondDoesName,
    //     thirdDoes: vaccine.thirdDoes,
    //     thirdDoesName: vaccine.thirdDoesName,
    //     hospitalName: vaccine.hospitalName,
    //     totalDoesGiven: vaccine.totalDoesGiven,
    //     vaccineId: vaccine.vaccineId,
    //   };

    //   vaccineCollection.insertOne(data).then((err, resutl) => {
    //     res.send({
    //       msg: "success",
    //       resutl,
    //     });
    //   });
    // }

    adminCollection.find({ email: vaccine.email }).toArray((err, document) => {
      if (document.length) {
        vaccineCollection.insertOne(vaccine).then((err, resutl) => {
          res.send({ msg: "success", result: resutl });
        });
      } else {
        res.send({ msg: "failed" });
      }
    });
  });

  app.post("/newadmin", (req, res) => {
    const admin = req.body;
    const user = req.body.password;
    if (user === "Murshed@@@k5") {
      adminCollection.insertOne(admin).then((error, resutl) => {
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
      .find({ email: admin.email, password: admin.password })
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

  console.log("connected");

  // client.close();
});

app.listen(process.env.PORT || 5000);
