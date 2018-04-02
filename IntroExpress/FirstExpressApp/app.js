var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// '/' => 'Hi there'
app.get('/', function(req, res){
    res.send('Hi there');
});
// Bye route
app.get('/bye', function(req, res){
    res.send('Bye there');
});
// dog route
app.get('/dog/:pup', function(req, res){
    var pup = req.params.pup;
    res.render('pup', {pupVar: pup});
});
// posts routes
app.get('/posts', function(req,res){
    var posts = [
        {title: 'Post 1', author: "steven"},
        {title: 'My shiny teeth and me', author: "Chip"},
        {title: 'Hit you with that midnight', author: "Frank"}
        ];
        
    res.render('posts', {posts: posts});
});

var friends = [
    'Brandon Wardell',
    'Steven Heneger',
    'Future Hendrix'
    ]

// post form friends
app.post('/addfriend', function(req, res){
    var friendly = req.body.newFriend;
    friends.push(friendly);
    res.redirect('/friends');
});

// friends page form
app.get('/friends', function(req,res){
    res.render('friends', {friends: friends})
})


// Tell express to listen for requests
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});