const express = require('express') //assigns the express variable to use express 
const app = express() // assigns the variable app to use express function
const MongoClient = require('mongodb').MongoClient //allows to use mongodb database 
const PORT = 2121 //assigns the port variable to local host 2121 when the server runs
require('dotenv').config()// allows to use a .env file to hide important api usernames and passwords


let db,
    dbConnectionStr = process.env.DB_STRING, // dbConnectionString is assigned to use the variable DB_STRING in the .env file to connect to the database
    dbName = 'todo' // assigns the database name being use to dbName

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to the monngo database with the username and password of the within the dbConnectionString variable
    .then(client => {
        console.log(`Connected to ${dbName} Database`) //console log if the connection to database is successful
        db = client.db(dbName) // assigns db to use the specific database
    })
    //middleware
app.set('view engine', 'ejs') // sets a static html template and is telling to use the ejs file.
app.use(express.static('public')) // it allows express to serve the static file in the public folder
app.use(express.urlencoded({ extended: true })) // recognizes the request object as strings or arrays
app.use(express.json()) // express recognized the object being sent as json data


app.get('/',async (request, response)=>{ //express makes a http request. The function being ran is an asynchronous function
    const todoItems = await db.collection('todos').find().toArray() // assigns the variable todoItems to go to the collection todo and find an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //assigns the variable itemsLeft to use the collection todo and returns the number of documents not completed in the collection 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the todoItems and itemsLeft data in the index.ejs template
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) // console logs error
})

app.post('/addTodo', (request, response) => { //allows a request that can add items in a collection
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // uses the todo database to add the value of todoItem from the thing property. Sets it as not complete
    .then(result => { //if it returns a promise then run the code
        console.log('Todo Added') // console log
        response.redirect('/') // redirects the page back to the main page of the app with the changes
    })
    .catch(error => console.error(error)) // console logs error
})

app.put('/markComplete', (request, response) => { //allows an item to be edited on the page
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //takes the todo database and update one element from the thing property with the value of itemFromJs
        $set: {
            completed: true // sets the complete property to true
          }
    },{
        sort: {_id: -1}, //sorts the object id in descending order
        upsert: false //it only does the put for the specific element that is chosen 
    })
    .then(result => { //if the promise returns then it will do the function
        console.log('Marked Complete') //console log
        response.json('Marked Complete') //sends the response in json
    })
    .catch(error => console.error(error)) //console logs the error

})

app.put('/markUnComplete', (request, response) => { // allows an item to be edited in the dom
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // takes the todo collection and updates one object with the thing parameter and itemFromJS value
        $set: {
            completed: false //sets the complete property to false
          }
    },{
        sort: {_id: -1}, //sort the object id in descending order
        upsert: false //it only does the put request for the element selected
    })
    .then(result => { // if the promise returns it runs the function
        console.log('Marked Complete') //console log
        response.json('Marked Complete') //sends the response in json to the response body
    })
    .catch(error => console.error(error)) // console log an error

})

app.delete('/deleteItem', (request, response) => { //sends a request to delete an item from the database
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // in the database collection of todo it will delete one object with the value of itemFromJS from the thing property
    .then(result => {
        console.log('Todo Deleted') //if delete is successfully ran then it will console log
        response.json('Todo Deleted') //respond with the json data todo deleted and puts it in the response body
    })
    .catch(error => console.error(error)) // if there is an error than it will console log the error

})

app.listen(process.env.PORT || PORT, ()=>{ //telling express to listen to the port variable or a port the server decides to open the page 
    console.log(`Server running on port ${PORT}`) //once connection is successful there will be a console log
})
