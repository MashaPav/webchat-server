const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

let Chat = mongoose.model("Chat", chatSchema); // Chat is a class

module.exports.getAll = (req, res) => {
  let filter = {};

  // getting from the URL query string (?userid=XXXXX)
  if (req.query.userid) {
    filter.userIds = req.query.userid;
  }
  Chat.find(filter)
    .populate("userIds", "userName")
    .then((result) => res.json(result));
};

module.exports.getById = (req, res) => {
    Chat.findById(req.params.id)
        .populate("userIds")
        .then((result) => res.json(result));
};
// return all chats for a specific users
module.exports.getContacts = (req, res) => {
    Chat.find({ userIds: req.params.id })
        .populate("userIds", "userName")
        .then((result) => res.json(result));
};

module.exports.createNew = (req, res) => {
    // creating a new message based on our request
    let chat = new Chat({
        // creating an instance of our model
        userIds: req.body.userIds
    });

    chat
        .save()
        .then((chat) => res.status(201).json(chat))
        .catch((err) => {
            console.error(err);
            res.status(500).send(`Internal server error: ${err}`); // 500 = internal server error
        });
};
/*
  module.exports.update = (req, res) => {
    Chat.findById(req.params.id).then((chat) => {
      if (chat) {
        chat.userIds = req.body.userIds;
  
        chat
          .save()
          .then((chat) => {
            if (chat) {
              res.json(chat);
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
*/
module.exports.delete = (req, res) => {
    Chat.findByIdAndRemove(req.params.id)
        .then((chat) => {
            if (chat) {
                res.json(chat);
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