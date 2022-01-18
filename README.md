MealMe


Description: MealMe is a community based app where users can create and share meals they've created with other people. It is intended for those that struggle with coming up with things to eat.
I created Mealme using Node.js, Mongoose, Express, EJS, Bootstrap, and Multer.
Users can create meals, search for meals based on search parameters, edit and delete meals they have created, like meals, and create collections of meals to schedule a full day of eating.

Challenges I faced: Whilst creating the collections, due to time constraints I had to choose between functionality or styling, I went with the former. I hope to revisit and make it more user friendly and less ugly. I also struggled with Multer and decided to hold off on adding that to production, and solve after my presentation.

Wire Frames

![Project2Home](https://user-images.githubusercontent.com/89940133/149842194-62654b0e-5399-4d1f-8cd0-e908e0e0e7c1.png)
![Project2EditMealsByID](https://user-images.githubusercontent.com/89940133/149842355-8907d929-4c4d-4c86-8a94-078d5498e6cd.png)
![Project2RandomDaysWorthOfMealsDisplayed](https://user-images.githubusercontent.com/89940133/149842377-1ac1a14e-2ee8-4f05-8524-3c9870a99ade.png)
![Project2ShowMyMealsByID](https://user-images.githubusercontent.com/89940133/149842400-ea9c14aa-698b-46e7-b954-1b4db55c93b8.png)

User Stories

MVP
As a user I can submit a meal to the database
As a user I can edit meals in the database
As a user I can delete meals in the database
As a user I can search for meals based on filters in the database
As a user I can get a week’s worth of random meals based on filters from the database

Stretch Goals
As a user I should be able to see updated prices with Kroger API
As a user I should get nutritional data from fatsecret API when adding meals.
As a user I should be able to login and see my stored meals
As a user I should be able to share my meals.

I decided to not go with any APIs for the app, because I didn't feel they made any sense for the direction I was going in. It would have been a burden on the user to get an inordinate amount of information to make it worth while. The main purpose of the app is to share ideas about what to cook, not neccesarily recipes.
