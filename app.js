const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { Schema } = mongoose;

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology:true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = new Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

//////////////////////////////// All Articles //////////////////////////////////////////////////////////
app.route('/articles')
.get((req, res)=>{
  Article.find((err, found)=>{
    if(!err){
      res.send(found);
    }
  });
})
.post((req, res)=>{
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save((err)=>{
    if(!err){
      res.send('Article Added');
    }
  });
})
.delete((req, res)=>{
  Article.deleteMany((err)=>{
    if(!err){
      res.send('Articles Deleted.');
    }
  });
});

///////////////////////// Specific Article ////////////////////////////////////////////////////////////

app.route('/articles/:search')
.get((req, res)=>{
  Article.findOne({title:req.params.search}, (err, found)=>{
    if(!err){
      res.send(found);
    }
  });
})

.put((req, res)=>{
  Article.updateOne(
    {title:req.params.search},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    (err)=>{
      if(!err){
        res.send("Update Successful.")
      }
    }
  );
})

.patch((req,res) => {
  Article.updateOne(
    {title:req.params.search},
    {$set: req.body},
    (err)=>{
      if(!err){
        res.send('Update Succesfull.');
      }
    }
  );
})

.delete((req,res)=>{
  Article.deleteOne(
    {title:req.params.search},
    (err)=>{
      if(!err) {
        res.send('Delete Succesful.');
      }
    }
  );
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
})
