const express = require('express')//creating a constant that allows us to use express in this file// 
const app = express()//creating a constant to this instance of express//
const MongoClient = require('mongodb').MongoClient//creating a constant that allows us to use methods associated with MongoClient to talk to our DB 
const PORT = 2121//setting the location where our DB is listening, in all caps because it's a global variable//
require('dotenv').config()//allows us to access variables inside the env file//


let db,//declaring the variable globally//
    dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning our DB strig to it//
    dbName = 'todo'//declaring a variable and assigning it the name of our DB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to MongoDB and then passing in our connection string, also passing in an additional property//
    .then(client => {//waiting for the connection and proceeding if successful and passing in all the client information//
        console.log(`Connected to ${dbName} Database`)//console logging connection confirmation in a template literal//
        db = client.db(dbName)//assigning a value to a previously declared db variable that contains a db client factory method//
    })//closing the .then//
    
app.set('view engine', 'ejs')//sets ejs as the default render//
app.use(express.static('public'))//sets the locations for static assets **public folder**//
app.use(express.urlencoded({ extended: true }))//tells express to decode and encode URLs where the header matches the content. Supports arrays and objects.//
app.use(express.json())//parses json content**replaces body parser**//


app.get('/',async (request, response)=>{//starts a GET method **Read request**, that sends you to the root file **homepage**, sets up req and res paramaters//
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items from the todos collection//
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})////sets a variable and awaits specific items from the todos collection**incomplete items**//
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//redering the ejs file and passing through the DB items and then counting the remaining items//

    //using try and catch instead
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    .catch(error => console.error(error))//uncommenting, was previously missing catch block//
})//closes the get//

app.post('/addTodo', (request, response) => {//starting post method when the add route is passed in//
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//inserts a new object into todos collection from the client side **input text box from form**, then adding a property of completed: false, so it will be displayed on the list with no strike through//
    .then(result => {//if insert is successful, do something//
        console.log('Todo Added')//console log notification of completed action from insertion//
        response.redirect('/')//redirect to home page//
    })//closes out of the .then//
    .catch(error => console.error(error))//adds a catch block in case the insertion fails, then it will throw an error//
})//closes out of the post//

app.put('/markComplete', (request, response) => {//starts a put method when the markComplete route is passed in//
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the DB for one item matching the name passed in from the main.js file that was clicked on//
        $set: {//setting a value//
            completed: true//setting the completed value to true//
          }//closing the set//
    },{//closing the update function, opening the sort//
        sort: {_id: -1},//moves item to the bottom of the list//
        upsert: false//prevents insertion if the item does not already exist//
    })//
    .then(result => {//starting a .then, if update was successful//
        console.log('Marked Complete')//console log this if successfully updated//
        response.json('Marked Complete')//sending a response back to the sender
    })//closing the .then//
    .catch(error => console.error(error))//catching errors//

})//closing put

app.put('/markUnComplete', (request, response) => {////starts a put method when the markUnComplete route is passed in//
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look in the DB for one item matching the name passed in from the main.js file that was clicked on//
        $set: {//setting a value//
            completed: true//setting the completed value to true//
          }//closing the set//
    },{//closing the update function, opening the sort//
        sort: {_id: -1},//moves item to the bottom of the list//
        upsert: false//prevents insertion if the item does not already exist//
    })//
    .then(result => {//starting a .then, if update was successful//
        console.log('Marked Complete')//console log this if successfully updated//
        response.json('Marked Complete')//sending a response back to the sender//
    })//closing the .then//
    .catch(error => console.error(error))//catching errors//

})//closing put

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed in//
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look inside the todos collection for the ONE item that has a name matching our JS file//
    .then(result => {//starts a .then if delete was successful//
        console.log('Todo Deleted')//console logs the success notification
        response.json('Todo Deleted')//sending a response back to the sender//
    })//closing the .then//
    .catch(error => console.error(error))//catching errors//

})//closing the delete//

app.listen(process.env.PORT || PORT, ()=>{//specifies which port we will be listening on and either gets the one out of the .env file **if exists**, or uses the PORT variable//
    console.log(`Server running on port ${PORT}`)//console log the template literal stating it was successful.//
})//closing the listen method//
