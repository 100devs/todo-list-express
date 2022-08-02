const express = require('express') /* lets us use express */
const app = express() /* assigns express method to variable we can use easier later */
const MongoClient = require('mongodb').MongoClient /* lets us use MongoDB */
const PORT = 2121 /* hard codes a server port */
require('dotenv').config() /* allows us to use .env to hide important things */


let db, /* creates a value with no value currently assigned, for use later */
    dbConnectionStr = process.env.DB_STRING, /* creates a variable to use in place of our databse string so that we can hide it in the .env file and not have people play with it */
    dbName = 'todo' /* creates a variable with the name of our database */

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) /* allows us to connect to the MongoDB database, and uses our hidden string to do so */
    .then(client => { /* says what to do once we are connected to the databse */
        console.log(`Connected to ${dbName} Database`) /* writes a string with the dbName value inserted to the console */
        db = client.db(dbName) /* assigns a value to the db variable */
    })
    
app.set('view engine', 'ejs') /* sets EJS as the default render method */
app.use(express.static('public')) /* sets location for static assets */
app.use(express.urlencoded({ extended: true })) /* tells express to decode and encode URLs where headers match content */
app.use(express.json()) /* enable parsing of JSON content from incoming requests */


app.get('/',async (request, response)=>{ /* starts a read method with request/response paramaters passed in for the root route */
    const todoItems = await db.collection('todos').find().toArray() /* sets a variable that waits for all of the items from the todo database and puts them in an array */
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) /* sets a variable that waits for the number of all of the items from the todo database that have a false completed value */
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) /* renders the EJS file and passes through the databse items and the number of items left to do */

    /* code that does the same as the above, but is less desirable */
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
}) /* closes the get */

app.post('/addTodo', (request, response) => { /* starts a create method with request/response parameters passed in for the addTodo route */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) /* inserts a new item into the database collection that matchs what the text was from the user submitted form, and has a default completed value of false */
    .then(result => { /* says what to do next if possible */
        console.log('Todo Added') /* writes "Todo Added" string into the console */
        response.redirect('/') /* redirects back to the give route, in this case the main root */
    }) /* closes the then */
    .catch(error => console.error(error)) /* if any errors occur, this catches them and writes them to the console */
}) /* closes the post */

app.put('/markComplete', (request, response) => { /* starts an update method with request/response paramaters passed in for the markComplete route */
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ /* looks in the database for the item matching what was clicked on and tells it to update part of it */
        $set: { /* says to set a value as follows */
            completed: true /* sets completed value to true */
          } /* closes the set */
    },{ /* closes the update and opens the sort */
        sort: {_id: -1}, /* sorts items in order */
        upsert: false /* used to insert and update a value, false by default */
    }) /* closes the sort */
    .then(result => { /* says what to do next if possible */
        console.log('Marked Complete') /* writes "Marked Complete" string to the console */
        response.json('Marked Complete') /* responds with JSON to the sender with "Marked Complete" */
    }) /* closes the then */
    .catch(error => console.error(error)) /* if any errors occur, this catches them and writes them to the console */
}) /* closes the put */

app.put('/markUnComplete', (request, response) => { /* starts an update method with request/response paramaters passed in for the markUnComplete route */
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ /* looks in the database for the item matching what was clicked on and tells it to update part of it */
        $set: { /* says to set a value as follows */
            completed: false /* sets completed value to false */
          } /* closes the set */
    },{ /* closes the update and opens the sort */
        sort: {_id: -1}, /* sorts items in order */
        upsert: false /* used to insert and update a value, false by default */
    }) /* closes the sort */
    .then(result => { /* says what to do next if possible */
        console.log('Marked Complete') /* writes "Marked Complete" string to the console. Believe this is a typo and should read "Marked UnComplete" */
        response.json('Marked Complete') /* responds with JSON to the sender with "Marked Complete". Believe this is a type and should read "Marked UnComplete" */
    })  /* closes the then */
    .catch(error => console.error(error)) /* if any errors occur, this catches them and writes them to the console */
}) /* closes the put */

app.delete('/deleteItem', (request, response) => { /* starts a delete method with request/response parameters pass in for the deleteItem route  */
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) /* looks in the database for the item matching what was clicked on and tells it to delete it */
    .then(result => { /* says what to do next if possible */
        console.log('Todo Deleted') /* writes "Todo Deleted" string to the console */
        response.json('Todo Deleted') /* responds with JSON to the sender with "Todo Deleted" */
    }) /* closes the then */
    .catch(error => console.error(error)) /* if any errors occur, this catches them and writes them to the console */
}) /* closes the delete */

app.listen(process.env.PORT || PORT, ()=>{  /* sets up the port the server will be listening on, either the string passed in by Heroku or the hard coded port variable */
    console.log(`Server running on port ${PORT}`) /* when the server has connected, writes the port that it has connected to into the console */
}) /*  closes the listen */