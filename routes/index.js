const express = require("express");
const router = express.Router();

// Models
const Ngo = require("../models/Ngo");
const Events = require("../models/Events");
const Volunteer = require("../models/Volunteer");

// Utility Packages
const request = require("request");

// Render the template
router.get("/template", async (req, res) => {
  try {
    return res.render("index_template");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the header
router.get("/headertemplate", async (req, res) => {
  try {
    return res.render("partials/header_notlogin");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the Bar graph
router.get("/bargraph", async (req, res) => {
  try {
    return res.render("barGraph");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Landing page
router.get("/", async (req, res) => {
  try {
    return res.render("index_template");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the Login and SignUp page
router.get("/login_ngo", async (req, res) => {
  try {
    return res.render("login_signup_ngo");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Login an NGO
router.post("/login_ngo", async (req, res) => {
  try {
    const ngo = await Ngo.findOne({username: req.body.username});

    // NGO does not exits
    if (!ngo) {
      return res.redirect("login_ngo");
    }

    // Matching the password
    if (ngo.password === req.body.password) {
      ngo.timesUsed += 1;
      ngo.save();

      return res.render("homepage", {user: ngo});
    }

    // Password does not match
    else {
      return res.redirect("login_ngo");
    }
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

router.post("/signup_ngo", async (req, res) => {
  try {
    const {name, username, password, location, volunteers} = req.body;

    // Create the object and save in the DB
    const ngo = new Ngo({
      name,
      username,
      password,
      location,
      volunteers,
      timesUsed: 0
    });

    await ngo.save();

    // Render the homepage
    return res.render("homepage", {user: ngo});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the page involving all the events
router.get("/events", async (req, res) => {
  try {
    const events = await Events.find({});
    return res.render("events", {events});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the page to add an event
router.get("/add_event", async (req, res) => {
  try {
    return res.render("add_event");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Create a new event
router.post("/add_event", async (req, res) => {
  try {
    const {date, topic, location, description} = req.body;

    // Create new event and save in the DB
    const event = new Events({
      date,
      topic,
      location,
      description
    });
    await event.save();

    return res.redirect("/events");
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render page to become volunteer
router.get("/become_volunteer", async (req, res) => {
  try {
    const ngos = await Ngo.find({});

    return res.render("ngos_list_volunteer", {ngos});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Get a specific NGO volunteer form
router.get("/:id/volunteer", async (req, res) => {
  try {
    const ngo = await Ngo.findOne({_id: req.params.id});

    return res.render("become_volunteer", {found: ngo});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Add a new volunteer in the DB
router.post("/become_volunteer", async (req, res) => {
  const ngo = await Ngo.findOne({_id: req.body.button});

  // Add the volunteer's number in the NGO
  ngo.volunteerinfo.push(req.body.phone);

  // New volunteer object
  const volunteer = new Volunteer({
    name: req.body.name,
    phone: req.body.phone
  });

  // Make changes in the DB
  await volunteer.save();
  await ngo.save();

  return res.redirect("/become_volunteer");
});

// Render a list of volunteers
router.get("/get_volunteers", async (req, res) => {
  try {
    const volunteers = Volunteer.find({});

    return res.render("volunteer_list", {volunteers});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Active NGOS
router.get("/activity_ngo", async (req, res) => {
  try {
    const ngos = await Ngo.find({});
    return res.render("active_ngo", {ngos});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Render the page which contains the form to contact the team for any doubts
router.get("/askadoubt", async (req, res) => {
  try {
    return res.render("doubts", {ques: "", answer: ""});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

// Doubts for the admins
router.post("/doubt", async (req, res) => {
  try {
    request(
      `https://bingsearchabcd.cognitiveservices.azure.com/bing/v7.0/search?q=${req.body.ques.toString()}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "28ab19c6510a4ec2bdce7278d7988d80"
        }
      },
      (err, response, body) => {
        const x = JSON.parse(response.body);
        if (err) {
          return res.status(400).json({
            success: false,
            message: err
          });
        }

        return res.render("doubts", {
          ques: req.body.ques.toString(),
          answer: x.webPages.value[0].snippet
        });
      }
    );
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error!"});
  }
});

module.exports = router;
