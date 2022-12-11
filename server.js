const express = require("express");
const connectDB = require("./config/connectDB");
const port = process.env.PORT || 3020;
const app = express();
app.use(express.json());
connectDB();



// Create and Save a Record of a Model
const User = require("./model/User");
app.post("/users", (req, res) => {
  const { name, age, favoriteFoods } = req.body;
  const Person = new User({ name, age, favoriteFoods });
  Person.save()
    .then(
      (newPerson) =>
        res.send({ msg: "User added SUCCESSFULLY.", newPerson }) &&
        console.log("User added SUCCESSFULLY.", newPerson)
    )
    .catch(
      (err) =>
        res.send({ msg: "Operation Failed!!", err }) &&
        console.log("Operation Failed!!", err)
    );
});

// Create Many Records with model.create()
app.post("/users/many", (req, res) => {
    const newUsers = req.body;
    User.create(newUsers, (err, data) => {
      data
        ? res.send({ msg: "All userS have been added SUCCESSFULLY", data }) &&
          console.log("All userS have been added SUCCESSFULLY", data)
        : res.send({ msg: "Adding new userS failed!!", err }) &&
          console.log("Adding new userS failed!!", err);
    });
  });
  
  // Use model.find() to Search Your Database
  app.get("/users", (req, res) => {
    User.find()
      .then(
        (users) =>S
          res.send({ msg: "Getting users Done", users }) &&
          console.log("Getting users Done", users)
      )
      .catch(
        (err) =>
          res.send({ msg: "Getting users Failed!!", err }) &&
          console.log("Getting users Failed!!", err)
      );
  });
  
  // Use model.findOne() to Return a Single Matching Document from Your Database
  app.get("/users/:userFood", (req, res) => {
    User.findOne({ favoriteFoods: req.params.userFood }).then((foodLover) => {
      foodLover
        ? res.status(200).send({ msg: "User has Founded", foodLover }) &&
          console.log("User has Founded", foodLover)
        : res
            .status(400)
            .send({ msg: "Cannot find any user loving this food!" }) &&
          console.log("Cannot find any user loving this food!");
    });
  });
  
  // Use model.findById() to Search Your Database By _id
  app.get("/users/user/:userId", (req, res) => {
    const id = req.params.userId;
    User.findById(id)
      .then(
        (user) =>
          res.status(200).send({ msg: "User has Founded", user }) &&
          console.log("User has Founded", user)
      )
      .catch(
        (err) =>
          res
            .status(400)
            .send({ msg: "Cannot find any user matching this ID!", err }) &&
          console.log("Cannot find any user matching this ID!")
      );
  });
  
  // Perform Classic Updates by Running Find, Edit, then Save
  app.put("/users/user/:userId", (req, res) => {
    const id = req.params.userId;
    User.findById(id, (err, person) => {
      err
        ? console.log(err)
        : person.favoriteFoods.push("hamburger") &&
          person.save((err, updatedUser) => {
            err
              ? console.log(err)
              : res.send({
                  msg: "Humburger is added SUCCESSFULLY",
                  updatedUser,
                }) && console.log("Humburger is added SUCCESSFULLY", updatedUser);
          });
    })
      .then(() => res.status(200))
      .catch(
        (err) =>
          res.status(400).send({ msg: "Update error", err }) &&
          console.log("Update error", err)
      );
  });
  
  // Perform New Updates on a Document Using model.findOneAndUpdate()
  app.put("/users/age/:userName", (req, res) => {
    const trg = req.params.userName;
    User.findOneAndUpdate({ name: trg }, { age: 20 }, { new: true })
      .then((updatedUser) => {
        !updatedUser
          ? res.send({ msg: "User not Found!" }) && console.log("User not FOUND!")
          : res
              .status(200)
              .send({ msg: `The age of ${trg} is changed to 20`, updatedUser }) &&
            console.log(`The age of ${trg} is changed to 20`, updatedUser);
      })
      .catch(
        (err) =>
          res.status(400).send({ msg: "Update error", err }) &&
          console.log("Update error", err)
      );
  });
  
  // Delete One Document Using model.findByIdAndRemove
  app.delete("/users/:userId", (req, res) => {
    const id = req.params.userId;
    User.findByIdAndRemove(id)
      .then((deleteUser) => {
        !deleteUser
          ? res.send({ msg: "User not FOUND!" }) && console.log("User not FOUND!")
          : res.status(200).send({
              msg: "The user has deleted SUCCESSFULLY",
              deleteUser,
            }) && console.log("The user has deleted SUCCESSFULLY", deleteUser);
      })
      .catch(
        (err) =>
          res.status(400).send({ msg: "Delete Error", err }) &&
          console.log("Delete Error", err)
      );
  });
  
  // Delete Many Documents with model.remove()
  app.delete("/users/delete/many", (req, res) => {
    const trg = "Mary";
    User.deleteMany({ name: trg })
      .then(() =>
        res.status(200).send({ msg: `Users whose name is ${trg} were deleted` })
      )
      .catch((err) => res.status(400).send({ msg: "Delete Error!", err }));
  });
  
  // Chain Search Query Helpers to Narrow Search Results
  app.get("/summary", (req, res, done) => {
    const trg = "Pizza";
    User.find({ favoriteFoods: trg })
      .sort({ name: 1 })
      .limit(2)
      .select({ age: 0 })
      .exec((err, users) => {
        if (err) {
          done(err);
          res.status(400).send({ msg: "Error!", err });
          console.log(err);
        } else {
          done(null, users);
          res.status(200).send({ msg: `2 users are ${trg} lovers`, users });
          console.log(`2 users are ${trg} lovers`, users);
        }
      });
  });
  
  // Starting the server
  app.listen(port, () => console.log(`Server is running on port ${port}`));
