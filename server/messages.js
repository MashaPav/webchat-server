const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  text: { type: String, required: true },
  date: Date, // this will always be Date.now()
  picURL: String
});

let Message = mongoose.model("Message", messageSchema); // Message is a class

module.exports.getAll = (req, res) => {
    // populate connects the property to it's referenced collection, by the ID
    // second parameter (optional) - which fields should be returned
  Message.find()
    .populate("author", "userName firstName lastName")
    .then((result) => res.json(result));
};

module.exports.getById = (req, res) => {
    Message.findById(req.params.id)
      .populate("author")
      .then((message) => {
        if (message) {
          res.json(message);
        } else {
          res.status(404).send(`404: message #${req.params.id} wasn't found`);
        }
      })
      .catch((err) => {
        res.status(404).send("Ilegal parameter");
      });
  };

  module.exports.getByChat = (req, res) => {
    // we can send a filter object to 'find'
    // in this case: return all chats equal(=) to a certain id
    Message.find({ chat: req.params.id })
      .populate("author")
      .then((result) => res.json(result));
  };
  
  module.exports.createNew = (req, res) => {
    // creating a new message based on our request
    let message = new Message({
      // creating an instance of our model
      author: req.body.author,
      chat: req.params.id,
      text: req.body.text,
      date: Date.now(),
      picURL: req.body.picURL
    });
  
    message
      .save()
      .then((message) => res.status(201).json(message))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Internal server error: ${err}`); // 500 = internal server error
      });
  };
  
  module.exports.update = (req, res) => {
    Message.findById(req.params.id).then((message) => {
      if (message) {
        message.text = req.body.text;
        message.date = req.body.date;
        message.picURL = req.body.picURL;
  
        message
          .save()
          .then((message) => {
            if (message) {
              res.json(message);
            }
          })
          .catch((err) => {
            // TODO: investigate error
            res.status(500).send(`internal server error: ${err}`);
          });
      } else {
        res
          .status(404)
          .send(`404: message #${req.params.id} wasn't found and cannot be updated`);
      }
    });
  };
  
  module.exports.delete = (req, res) => {
    Message.findByIdAndRemove(req.params.id)
      .then((message) => {
        if (message) {
          res.json(message);
        } else {
          res
            .status(404)
            .send(
              `404: message #${req.params.id} wasn't found and cannot be deleted`
            );
        }
      })
      .catch((err) => {
        // TODO: investigate error
        res.status(500).send(`internal server error: ${err}`);
      });
  };