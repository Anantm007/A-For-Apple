const express = require("express");
const router = express.Router();

// Models
const Ngo = require("../models/Ngo");
const Events = require("../models/Events");
const Volunteer = require("../models/Volunteer");

// Utility Packages
const request = require("request");

// Render the template
router.get("/template", function (req, res) {
  try {
    return res.render("index_template");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the header
router.get("/headertemplate", function (req, res) {
  try {
    return res.render("partials/header_notlogin");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the Bar graph
router.get("/bargraph", function (req, res) {
  return res.render("barGraph");
});

// Landing page
router.get("/", function (req, res) {
  return res.render("index_template");
});

// Render the Login and SignUp page
router.get("/login_ngo", function (req, res) {
  return res.render("login_signup_ngo");
});

// Login an NGO
router.post("/login_ngo", function (req, res) {
  const ngo = await Ngo.findOne({ username: req.body.username });
    
  if (!ngo) {
      console.log("User does not exist!");
      return res.redirect("login_ngo");
        }
  if (ngo.password === req.body.password) {
      ngo.timesUsed += 1;
      ngo.save();

      return res.render("homepage", { user: ngo });
    } else {
      console.log("Wrong password");
      res.redirect("login_ngo");
    }
    
});

router.post("/signup_ngo", function (req, res) {
  var newngo = new Ngo({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    location: req.body.location,
    volunteers: req.body.volunteers,
    timesUsed: 0,
  });
  newngo.save();
  return res.render("homepage", { user: newngo });
});

//Handling Events page Logic
router.get("/events", function (req, res) {
  Events.find({}, function (err, result) {
    return res.render("events", { events: result });
  });
});

router.get("/add_event", function (req, res) {
  return res.render("add_event");
});

router.post("/add_event", function (req, res) {
  const newevent = new Events({
    date: req.body.date,
    topic: req.body.topic,
    location: req.body.location,
    description: req.body.description,
  });
  newevent.save();
  res.redirect("/events");
});

//Handling Volunteer pages Logic

router.get("/become_volunteer", function (req, res) {
  Ngo.find({}, function (err, result) {
    return res.render("ngos_list_volunteer", { ngos: result });
  });
});

router.get("/:id/volunteer", function (req, res) {
  Ngo.findOne({ _id: req.params.id }, function (err, found) {
    return res.render("become_volunteer", { found: found });
  });
});

router.post("/become_volunteer", function (req, res) {
  Ngo.findOne({ _id: req.body.button }, function (err, found) {
    found.volunteerinfo.push(req.body.phone);
    const newvol = new Volunteer({
      name: req.body.name,
      phone: req.body.phone,
    });
    newvol.save();
    found.save();
  });

  res.redirect("/become_volunteer");
});

router.get("/get_volunteers", function (req, res) {
  Volunteer.find({}, function (err, result) {
    return res.render("volunteer_list", { volunteers: result });
  });
});

router.get("/activity_ngo", function (req, res) {
  Ngo.find({}, function (err, result) {
    return res.render("active_ngo", { ngos: result });
  });
});

router.get("/askadoubt", async (req, res) => {
  return res.render("doubts", { ques: "", answer: "" });
});

// Doubts
router.post("/doubt", async (req, res) => {
  request(
    `https://bingsearchabcd.cognitiveservices.azure.com/bing/v7.0/search?q=${req.body.ques.toString()}`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": "28ab19c6510a4ec2bdce7278d7988d80",
      },
    },
    (err, response, body) => {
      const x = JSON.parse(response.body);
      console.log("lol", x.webPages.value[0].snippet);
      if (err) {
        return res.json({
          success: false,
          message: err,
        });
      }
       return res.render("doubts", {
        ques: req.body.ques.toString(),
        answer: x.webPages.value[0].snippet,
      });
    }
  );
});

module.exports = router;
