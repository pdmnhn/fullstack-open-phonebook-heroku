/* eslint-disable no-undef */
const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("person", entrySchema);

const logPhonebook = (password) => {
  const url = `mongodb+srv://fullstack-open:${password}@cluster0.js7o1.mongodb.net/phonebook?retryWrites=true&w=majority`;
  mongoose.connect(url);
  Person.find({}).then((result) => {
    console.log("phonebook:");
    for (let entry of result) {
      console.log(entry.name, entry.number);
    }
    mongoose.connection.close();
  });
};

const addPerson = (password, name, number) => {
  const url = `mongodb+srv://fullstack-open:${password}@cluster0.js7o1.mongodb.net/phonebook?retryWrites=true&w=majority`;
  mongoose.connect(url);
  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  logPhonebook(process.argv[2]);
} else if (process.argv.length === 5) {
  addPerson(process.argv[2], process.argv[3], process.argv[4]);
} else {
  console.log(
    "Use correct arguments like, node mongo.js <password> Optional:<name> <number>"
  );
  process.exit(1);
}
