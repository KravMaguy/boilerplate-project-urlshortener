require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost:27017/urlsToShorten", {
  useNewUrlParser: true,
});
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlSchema = {
  name: String,
  code: Number,
};
const ShortenedUrl = mongoose.model("ShortenedUrl", urlSchema);

app.post("/api/shorturl/new", function (req, res) {
  url = req.body.url;
  ShortenedUrl.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      console.log("founditems is zero");
      const dbUrl = new ShortenedUrl({
        name: url,
        code: 0,
      });
      dbUrl.save(function (err) {
        if (err) return console.log(err, "there was an error saving it");
        // saved!
        console.log("saved successfully first one code zero");
      });
    } else {
      // ShortenedUrl.sort({ code: 'asc'});
      console.log('there is already items in collection')

    }
  });
  res.json({ url });

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
