require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});



const personSchema = new Schema({name: {type: String, required: true}, age: Number, favoriteFoods: [String]});

let Person = mongoose.model('Person', personSchema) ;


const createAndSavePerson = (done) => {
  const nameNicolas = new Person({name: 'nicolas', age:21, favoriteFoods:["maça", "banana"]});
  nameNicolas.save(function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  });
};


const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  });
};

const findPeopleByName = (personName, done) => {
    Person.find({name: personName}, function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  });
};

const findOneByFood = (food, done) => {
   Person.findOne({favoriteFoods: food}, function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  });
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, function(err, data){
    if(err){
      return console.log(err);
    }
    data.favoriteFoods.push(foodToAdd);

    data.save((err, update) => {
      if(err){
      return console.log(err);
      }
      done(null, data)
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, 
  {new: true}, (err, update) => {
      if(err){
      return console.log(err);
      }
      done(null, update);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err, data){
    if(err){
      return console.log(err);
    }
    done(null, data)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, function(err, data){
     if(err){
      return console.log(err);
    }
    done(null, data)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch}).sort({name: 1}).limit(2).select({name: 1, favoriteFoods: 1}).exec(function(err, data){
     if(err){
      return console.log(err);
    }
    done(null, data)
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
