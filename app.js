
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ListDB");

const itemSchema = {
  post: String
};

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({post:"Welcome to your to do list"});
const item2 = new Item({post:"Hit the + button to add a new item"});
const item3 = new Item({post:"<-- Hit this button to delete an item"});

const defaultItems = [item1, item2, item3];



app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){console.log(err);}
          else{console.log("Successsfully inserted the items in DB");}
      });
      res.redirect("/");
    }else{
      const day = date.getDate();
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    post:itemName
  });
item.save();
res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
