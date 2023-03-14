const express = require('express')//loads express modules
const app = express()//creates a variable to call express methods from. Makes code easier to read.
const MongoClient = require('mongodb').MongoClient//loads mongodb modules for communicating with database
const PORT = 2121//global variable for PORT we are using
require('dotenv').config()//loads dotenv modules and configures them so that server can use .env to access hidden variables such as db string
//because we don't want to push our DB string (contains login info) to github.

let db,//stores db info for collection we want to connect to
    dbConnectionStr = process.env.DB_STRING,//gets DB_STRING from .env file needed to connect to collection
    dbName = 'todo'//stores the name of collection we will be accessing
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//sets up a connection to MongoDB using DB_STRING
    .then(client => {//once connect promise is fufilled do the following while passing in client info (we don't use it here)
        console.log(`Connected to ${dbName} Database`)//logs which collection in database we are connected to
        db = client.db(dbName)//stores connection to collection dbName in db variable
    })
    
app.set('view engine', 'ejs')//allows use of ejs template to generate HTML
app.use(express.static('public'))//tells server to look in public folder for client side files (css, js, ejs)
app.use(express.urlencoded({ extended: true }))//middleware for parsing info from forms
app.use(express.json())//middleware for parsing incoming JSON requests from forms


app.get('/',async (request, response)=>{//get request for what will show up on homepage (index.ejs). it is async function because we are requesting data from DB and must wait for response.
    const todoItems = await db.collection('todos').find().toArray()//gets all the items in 'todos' collection as array and waits to recieve them to put into toDoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//gets number of items that have not been completed and waits for response to put them into itemsLeft
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//passes toDoItems and itemsLeft to index.ejs to be rendered as an html list 
    // db.collection('todos').find().toArray()//db collection methods return a Promise so can use .then .catch syntax instead of async await if you want. hard to read.
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//post request with route /addToDo. When someone adds a task on form it gets routed here
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//adds a new task in collection as an object with thing being the text from form and completed initially set to false
    .then(result => {//when the promise from instertOne is fullfilled do the following while passing in results of fufilled promise
        console.log('Todo Added')//log what happed
        response.redirect('/')//redirect to homepage which will render the new list of tasks in using ejs
    })
    .catch(error => console.error(error))//catches and logs any errors that occur while accessing db
})

app.put('/markComplete', (request, response) => {//put request with route /markComplete. this happends when a task in list is clicked
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//finds the item in collection matching task that was clicked and updates to completed
        $set: {
            completed: true//updates item's completed key to true in db
          }
    },{
        sort: {_id: -1},//in case there are duplicate tasks makes sure to update the oldest one
        upsert: false//item is not in db don't add it
    })
    .then(result => {//when updateOne fullfills promise do this stuff
        console.log('Marked Complete')//logs task marked complete
        response.json('Marked Complete')//sends a json response  "marked complete" back to browser
    })
    .catch(error => console.error(error))//catches errors that occur during updateOne

})

app.put('/markUnComplete', (request, response) => {//put request with route /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//finds the item in collection matching task that was clicked and updates to Uncompleted
        $set: {
            completed: false//sets item complete key to false in db
          }
    },{
        sort: {_id: -1},//in case of duplicates chooses oldest task. This causes clicking newest duplicate to change the oldest one to complete.
        upsert: false//if there is no item in db that match does not add a new one
    })
    .then(result => {//once updateOne promise is resovled do the follwing
        console.log('Marked Complete')//log what happened. should be "Marked incomplete"
        response.json('Marked Complete')//sends a json response that should be "Marked Incomplete"
    })
    .catch(error => console.error(error))//catches any errors that may have occured updating and logs

})

app.delete('/deleteItem', (request, response) => {//delete request with route /deleteItem from clicking trash can icon on a task
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//uses task text to find in collection and then removes.(this one does not deal with duplicates? Yeah will not necessarily delete task that trash was clicked on if there are dublicates)
    .then(result => {//once deleteOne Promise fullfilled do
        console.log('Todo Deleted')//logs what happened
        response.json('Todo Deleted')//sends json reponse of log to browser
    })
    .catch(error => console.error(error))//catches errors that could have occured during deleteOne

})

app.listen(process.env.PORT || PORT, ()=>{//tells server which port to listen to. If server has preferred port in .env uses that. IF no preference uses our PORT variable (2121)
    console.log(`Server running on port ${process.env.PORT||PORT}`)//logs what port server is running on.
})