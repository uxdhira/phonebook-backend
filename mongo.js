// EXERCISE 3.12: command-line database
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb://uxdhira_db_user:${password}@ac-9hzxmw4-shard-00-00.e1rpcdf.mongodb.net:27017,ac-9hzxmw4-shard-00-01.e1rpcdf.mongodb.net:27017,ac-9hzxmw4-shard-00-02.e1rpcdf.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-80tmsh-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log("phonebook:");
      persons.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("error:", error.message);
      mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person
    .save()
    .then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log("error:", error.message);
      mongoose.connection.close();
    });
} else {
  console.log("usage: node mongo.js <password> [name] [number]");
  mongoose.connection.close();
}
