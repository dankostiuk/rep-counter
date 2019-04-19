var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");

var indexRouter = require("./routes/index");
var workoutRouter = require("./routes/workouts");
var exerciseRouter = require("./routes/exercises");
require("dotenv").config();

var app = express();

// passport config
require("./config/passport")(passport);

// connect to Mongo when the app initializes
mongoose
  .connect(process.env.DB_CONN, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// express session
app.use(
  session({
    //key: 'user_id',
    secret: "secret",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
    //cookie: { expires: 365 * 24 * 60 * 60 * 1000, },
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", indexRouter);
app.use("/workout", workoutRouter);
app.use("/exercise", exerciseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
