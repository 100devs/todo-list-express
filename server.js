const express = require('express') //connection to express establish and allows it to be used
const app = express() //Saving express in this variable to make calling it easier
const MongoClient = require('mongodb').MongoClient //Setting up MongoClient to allow us to use the associated methods to communicate with the database in MongoDb
const PORT = 2121 //Setting variable PORT to 2121 to be used in the server listening
require('dotenv').config() //this allows for the variables in the .env file to be used and referenced


let db, //starting variable creation starting with empty db variable
    dbConnectionStr = process.env.DB_STRING, //declare variable with value of DB_STRING from the .env file
    dbName = 'todo' //variable with text 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Connecting to mongodb using the connection string, passing property useUnifiedTopology as true
    .then(client => { //if the connection is successful, processing the following code
        console.log(`Connected to ${dbName} Database`) //logging connection verification to the console
        db = client.db(dbName) //setting the db variable to the db method
    }) //closing connection delcaration
    
app.set('view engine', 'ejs') //setting ejs as the way to render content
app.use(express.static('public')) //provides the public folder as a path for express to use for static assets (like the css)
app.use(express.urlencoded({ extended: true })) //Express will encode and decode using URLS where the header matches the content
app.use(express.json()) //assists with parsing json


app.get('/',async (request, response)=>{ //start of a get method for the root route. Establish request and response params
    const todoItems = await db.collection('todos').find().toArray() //assigning the entire collection as an array to a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //settings the itemsLeft as a number of items in the collection that are not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render the response in the ejs file, include the item array and itemsleft variable in an object in the response
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //Post method which will create content to be added to the database, add req and res params
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //adding 1 items to the db collection with the completed status set to false
    .then(result => { // if add is successful, process following code
        console.log('Todo Added') //Log success to the console
        response.redirect('/') //reload the page to process updateds
    })
    .catch(error => console.error(error)) //if the add it unsuccessful, catch the error and log it
}) //end of the post method

app.put('/markComplete', (request, response) => { //Put methood that will be used to update some part of an item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //updating 1 item in teh collection by matching the 'thing' of the task. Seems like using the ID would be safer though
        $set: { //starting the update, we are going to set a value
            completed: true //updated the completed status to true
          }//end of the process to set the value to true
    },{ //closing set and starting next option
        sort: {_id: -1}, //sets the item to the end of the list
        upsert: false //if the item doesn't exist, prevents it from being inserted
    })//end of the update process
    .then(result => { //if update was successful, process following code
        console.log('Marked Complete') //log the successful change
        response.json('Marked Complete') //return the success message as json
    })// clsoing then
    .catch(error => console.error(error))//if the update failed, return the error message to the console
})//ending put method

app.put('/markUnComplete', (request, response) => { //Put methood that will be used to update some part of an item
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updating 1 item in the collection by matching the 'thing' of the task.
        $set: {  //starting the update, we are going to set a value
            completed: false//updated the completed status to true
          }//end of the process to set the value to true
    },{//closing set and starting next option
        sort: {_id: -1},//sets the item to the end of the list
        upsert: false//if the item doesn't exist, prevents it from being inserted
    })//end of the update process
    .then(result => {//if update was successful, process following code
        console.log('Marked Complete')//log the successful change
        response.json('Marked Complete')//return the success message as json
    }) //closing then
    .catch(error => console.error(error))//if the update failed, return the error message to the console

})//ending put method

app.delete('/deleteItem', (request, response) => {//delete method that will be used to delete an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //selecting the item using the content of the 'thing' property and deleting it
    .then(result => {//if delete was successful, process following co
        console.log('Todo Deleted')//log the successful deletion
        response.json('Todo Deleted')//return the success message as json
    })//closing then
    .catch(error => console.error(error))//if the update failed, return the error message to the console

})//ending deletion

app.listen(process.env.PORT || PORT, ()=>{ //setting up the port to be listening to. Port from ENV file as if there, or the port variable set in this file
    console.log(`Server running on port ${PORT}`) //log the port if listened successfully
})//closing listen