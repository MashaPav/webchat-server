const mongoose = require("mongoose");

// a Schema is a way of defining how our data looks like in MongoDB
// Supported types are:
// String, Number, Date,
// Buffer (for storing binary data), Boolean and ObjectID.
// _id is added automatically
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    phoneNumber: String,
    firstName: String,
    lastName: String,
    picURL: String,
});

// a Model is a function used to create a Class definition (not an instance!)
// based on the Schema.
// this class also helps us to communicate with the DB
// 1st parameter is the singular upperCased name of the *collection* in the DB (users -> User)
// 2nd parameter is the schema
let User = mongoose.model("User", userSchema); // User is a class

// User.init(); // when we need to create a new index

module.exports.getAll = (req, res) => {
    // model.find() without parameters, returns all objects in a collection
    // https://mongoosejs.com/docs/api.html#model_Model.find
  let filter = {};
  // creating a search filter if provided
  if (req.body.search) {
    // searching by first name only
    // using regular expression, finding all users containing the search string
    // (i = case insensitive)
    // filter.firstName = new RegExp(req.body.search, "i");

    // searching on first & last names together
    let regExp = new RegExp(req.body.search, "i");
    filter = { $or: [{ firstName: regExp }, { lastName: regExp }] };
  }
  User.find(filter).then((result) => res.json(result));
};

module.exports.getById = (req, res) => {
  getUserById(req.params.id, res);
};

module.exports.getLoggedUserByCookie = (req, res) => {
  getUserById(req.cookies.userId, res);
};

const getUserById = (userId, res) => {
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send(`404: user #${req.params.id} wasn't found`);
      }
    })
    .catch((err) => {
      res.status(500).send("500: Ilegal parameter");
    });
};
  
module.exports.createNew = (req, res) => {
  // creating a new user based on our request
let user = new User({
  // creating an instance of our model
  userName: req.body.userName,
  phoneNumber: req.body.phoneNumber,
  firstName: req.body.firstName,
  lastName: req.body.lastName,
  picURL: req.body.picURL,
});

  user
    .save()
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Internal server error: ${err}`); // 500 = internal server error
    });
};
  
module.exports.update = (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (user) {
      user.userName = req.body.userName;
      user.phoneNumber = req.body.phoneNumber;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.picURL = req.body.picURL;

      user
        .save()
        .then((user) => {
          if (user) {
            res.json(user);
          }
        })
        .catch((err) => {
          // TODO: investigate error
          res.status(500).send(`internal server error: ${err}`);
        });
    } else {
      res
        .status(404)
        .send(`404: user #${req.params.id} wasn't found and cannot be updated`);
    }
  });
};
  
module.exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(404)
          .send(
            `404: user #${req.params.id} wasn't found and cannot be deleted`
          );
      }
    })
    .catch((err) => {
      // TODO: investigate error
      res.status(500).send(`internal server error: ${err}`);
    });
};