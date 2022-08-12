const express = require('express')//bringing in express to our node server
const app = express()//calling our express middleware app
const MongoClient = require('mongodb').MongoClient // setting a variable called MongoClient for 
//our MongoClient which lets us talk to the db 
const PORT = 2121 //says which port we're going to be using
require('dotenv').config()//dotenv is what lets us hide sensitive information


let db,//setting a global variable and not assigning it
    dbConnectionStr = process.env.DB_STRING,//assigning our db connection string to our env file which we've hidden
    dbName = 'todo'//giving the cluster a name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connecting our database with our connection string
//useUnifiedTopology I think defaults to true, my understanding is it lets us use the drivers connection management system
    .then(client => {//waiting for the connection to be successful
        console.log(`Connected to ${dbName} Database`)//console logging our success
        db = client.db(dbName)//assiging a value to our previously declared variable
    })//closing the function
    
app.set('view engine', 'ejs')//telling our express how to reder data
app.use(express.static('public'))//telling out express where our static assets are
app.use(express.urlencoded({ extended: true }))//tells express to encode and decode URLs where header matches content
app.use(express.json())//parses json


app.get('/',async (request, response)=>{//reads everything from the base route
    const todoItems = await db.collection('todos').find().toArray()//setting a variable for the todo items and makes an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable for todo items that are
    //not completed and returns a count of them to display
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//tells server to render in the index.ejs file 
    //the items and the itemsLeft object

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//create route, takes the submit from our form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//creates a new object in the db
    //gives it a completed value of false by default 
    .then(result => {//waits for success of the post request
        console.log('Todo Added')//console logs "Todo Added"
        response.redirect('/')//brings us back to the root url
    })//closes the insertOne function
    .catch(error => console.error(error))//shows if there is an error
})//closes function

app.put('/markComplete', (request, response) => {//update route, used by our event listener in our javascript
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates our object with the name of the js
        // that was clicked on
        //calling it thing instead of looking up by ID is going to cause problems. 
        $set: {//changes the value of something in the database
            completed: true//changes the completed value to true
          }//closes set
    },{
        sort: {_id: -1},//moves item to bottom
        upsert: false//prevents insertion if it does not exist
    })//closes function
    .then(result => {//waits for success
        console.log('Marked Complete')//console logs the message
        response.json('Marked Complete')//showing the function worked
    })//closes then
    .catch(error => console.error(error))//console logs any errors

})//closes put

app.put('/markUnComplete', (request, response) => {//update route, used by our event listener in our javascript
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updates the object with the matching name of the todo
        //that was clicked
        $set: {//changes the value of something in the db
            completed: false//changes value to false
          }//closes set
    },{
        sort: {_id: -1},//moves item to bottom
        upsert: false//prevents insertion if it does not exist
    })//closes function
    .then(result => {//waits for success
        console.log('Marked Complete')//console logs the message
        response.json('Marked Complete')//showing the function worked
    })//closes then
    .catch(error => console.error(error))//console logs any errors

})//closes put

app.delete('/deleteItem', (request, response) => {//delete route used by our event listener in our javascript
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//finds matching todo of what was clicked and deletes it
    .then(result => {//waits for success
        console.log('Todo Deleted')//console logs the message
        response.json('Todo Deleted')//shows the function worked
    })//closes then
    .catch(error => console.error(error))//console logs any errors

})//closes delete

app.listen(process.env.PORT || PORT, ()=>{//tells server what port to listen on, declared port or an assigned port
    console.log(`Server running on port ${PORT}`)//tells us we're running successfully in the console
})//closes listen