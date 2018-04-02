var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/blog_demo_2");

// POST SCHEMA
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

var Post = mongoose.model("Post", postSchema);

// USER SCHEMA
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

var User = mongoose.model("User", userSchema);

User.creeate({
    email: "bob@gmail.com",
    name: "Bob Belcher"
})
// newUser.save(function(err, user){
//   if(err){
//       console.log(err);
//   } else {
//       console.log(user);
//   }
// });


