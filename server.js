require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// mongoose.connect("mongodb://localhost:27017/urlsToShorten", {
//   useNewUrlParser: true, useUnifiedTopology: true
// });
const connection=process.env.connection

mongoose.connect(connection, {
  useNewUrlParser: true,useUnifiedTopology: true
});

if(!connection){
  throw new Error('Required connection missing');
} else {
  console.log(connection)
}
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

app.get("/api/shorturl/:code", function(req, res){
  foundcode=req.params.code
  ShortenedUrl.findOne({code:foundcode}).exec((err, result) => {
    if(err) return res.send(err)
    if(!err && result!=undefined){
      console.log('redirectiong')
      res.redirect(result.name)
    } else {
      res.json({error:'an error occurred'})
    }
  })
})

app.post("/api/shorturl/new", function (req, res) {
  url = req.body.url;
  var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
  if(!valid) return res.json({error:'Invalid URL'})
  let inc;
  ShortenedUrl.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      inc=0;
      console.log("founditems is zero");
      const dbUrl = new ShortenedUrl({
        name: url,
        code: inc,
      });
      dbUrl.save(function (err) {
        if (err) return console.log(err, "there was an error saving it");
        console.log("saved successfully first one code zero");
      });
    } else {
      console.log("there is already items in collection");
      ShortenedUrl.findOne({})
        .sort({ code: "desc" })
        .exec((error, res) => {
          if (!err) {
            inc = res.code + 1;
            console.log("adding new item with code =", inc);
            const dbUrl = new ShortenedUrl({
              name: url,
              code: inc,
            });
            dbUrl.save(function (err, res) {
              if (err) return console.log(err, "there was an error ln 53");
              // saved!
              console.log(`${res} saved success w code `);
            });
          } else {
            console.log(err, "the err");
          }
        });
    }
  });
  res.json({ original_url:url, short_url:inc });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});