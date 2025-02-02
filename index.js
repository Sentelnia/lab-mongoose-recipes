const mongoose = require("mongoose");

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require("./models/Recipe.model");
// Import of the data from './data.json'
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);

    return self.connection.dropDatabase();
  })
  //une seule recette dans la database
  .then(() => {
    Recipe.create({
      title: "Asian Glazed Chicken Thighs",
      level: "Amateur Chef",
      ingredients: [
        "1/2 cup rice vinegar",
        "5 tablespoons honey",
        "1/3 cup soy sauce (such as Silver Swan®)",
        "1/4 cup Asian (toasted) sesame oil",
        "3 tablespoons Asian chili garlic sauce",
        "3 tablespoons minced garlic",
        "salt to taste",
        "8 skinless, boneless chicken thighs",
      ],
      cuisine: "Asian",
      dishType: "main_course",
      image:
        "https://images.media-allrecipes.com/userphotos/720x405/815964.jpg",
      duration: 40,
      creator: "Chef LePapu",
    })
      .then((recipe) => console.log(recipe.title))
      //plusieurs recettes dans la database
      .then(() => {
        Recipe.insertMany(data)
          .then((recipes) =>
            recipes.forEach((recipe) => console.log(recipe.title))
          )
          .then(() => {
            //Update recipe
            Recipe.updateOne(
              { title: "Rigatoni alla Genovese" },
              { duration: 100 }
            )
              .then(() => console.log(`The duration was updated`))
              .then(() => {
                //Update recipe
                Recipe.deleteOne({ title: "Carrot Cake" })
                  .then(() => console.log(`The recipe was delated`))
                  //close connection une fois que tout est fait
                  .then(()=> mongoose.connection.close())
                  .catch((err) => console.log);
              })
              .catch((err) => console.log);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

