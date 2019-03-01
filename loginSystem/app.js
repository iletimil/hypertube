const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'hypertube',
    resave: true,
    saveUninitialized: true
}));
app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));
let User = require('./models/users');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

let registration = require('./routes/registration');
app.use('/user', registration);

mongoose.connect(config.database);
let db = mongoose.connection;
db.once('open', function(){
    console.log('Connected');
});
db.on('error', function(err){
    console.log(err);
}); 

app.get('/', function(req, res){
    res.render("index", {
        title:'Hypertube | Welcome'
    });
});

app.get('/home', function(req, res, next){
    if(req.user)
    {
        res.render("home", {
            title:'Hypertube | Home'
        });
    }
    else
    {
        req.flash("danger", "You need to be logged in");
        res.redirect('/');
    }
    next();
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});