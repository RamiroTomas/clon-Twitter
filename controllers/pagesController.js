const formidable = require("formidable");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const bcrypt = require("bcryptjs");
const formatDistanceToNow = require("date-fns/formatDistanceToNow");

async function showHome(req, res) {
  const users = await User.find();
  const follows = req.user.following;
  follows.push(req.user._id);
  const tweets = await Tweet.find({
    author: follows,
  })
    .populate("author")
    .sort({ date: -1 });
  //console.log(tweets);
  const tweetsLength = Math.min(20, tweets.length);

  res.render("pages/home", { tweets, tweetsLength, req, users, formatDistanceToNow });
}

async function login(req, res) {
  res.render("pages/log-in");
}

async function showContact(req, res) {
  res.render("pages/contact");
}

async function showAboutUs(req, res) {
  res.render("pages/aboutUs");
}

async function store(req, res) {
  //console.log(__dirname);
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    let password = await bcrypt.hash(fields.password, 8);
    const user = await User.create({
      firstname: fields.firstname,
      lastname: fields.lastname,
      email: fields.email,
      username: fields.username,
      photoProfile: "/img/" + files.file.newFilename,
      photoPortada: "/img/" + files.file2.newFilename,
      password: password,
    });

    await user.save();
  });
  //console.log("fields");
  return res.redirect("/");
}

async function show404(req, res) {
  res.status(404).render("pages/404");
}

// Otros handlers...
// ...

module.exports = {
  showHome,
  showContact,
  showAboutUs,
  login,
  store,
};
