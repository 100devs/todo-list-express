const express = require('express')//require() is a Node function that lets you import module code into other code. 
//                              ....Express is a module ..this imports the Express module by name. (specifying express as the string)
const app = express()  // calls the express function and puts new Express application inside the app variable
const MongoClient = require('mongodb').MongoClient //the driver for Mongodb module.
const PORT = 2121   //assigning the port number to a variable 
require('dotenv').config()// module for dotenv file to be able to use it


let db,                                             //creating/assigning multiple variables 
    dbConnectionStr = process.env.DB_STRING,   //process.env=global variable
    dbName = 'todo'                             // assigned to a string of 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //using the MongoClient variable  to connect to the Mongo database variable which is samved in the env file.
    .then(client => { //returns a promise
        console.log(`Connected to ${dbName} Database`)  // console logging(printing) string to console with database variable 
        db = client.db(dbName)   //assigning db to equal this syntax
    })
    
app.set('view engine', 'ejs')  //app.set is a function used to assing the setting name to a value.use express to store and retrieve variables. can se the first to equal the 2nd -> view engine is ejs. (parameters doesnt mean anything)
app.use(express.static('public'))                   //function is a built-in middleware function in Express. It serves static files and is based on serve-static.
app.use(express.urlencoded({ extended: true })) //It parses incoming requests with urlencoded payloads and is based on body-parser......When extended property is set to true, the URL-encoded data will be parsed with the qs library.
app.use(express.json()) //It parses incoming requests with JSON 


app.get('/',async (request, response)=>{ //routes the request to the path which is being specified with the specified callback functions
    const todoItems = await db.collection('todos').find().toArray() // assigning variable todoItems to await a promise of all items from teh todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})  //assigns variable and awaits a count of uncompleted items to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //starts a post method when the add route is passed in 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //inserts new item to todos colelction, gives it a compelted value of false by default
    .then(result => { //if insert is successfull do something
        console.log('Todo Added') //prints string to console
        response.redirect('/')// gets rid of the /addTodo route and redirects to homepage 
    })
    .catch(error => console.error(error)) //catches errors
})

app.put('/markComplete', (request, response) => { // starts put method when the add route is passed in 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into db for matching item of the item passed in from main js
        $set: {
            completed: true //completed status to true
          }
    },{
        sort: {_id: -1}, //moves item to bottom of the list
        upsert: false //stops insertion if item doesnt exist
    })
    .then(result => { //starts a then if update succeeds 
        console.log('Marked Complete') //logs string
        response.json('Marked Complete') //responds with json to sender
    })
    .catch(error => console.error(error)) //catches errors

})

app.put('/markUnComplete', (request, response) => { //starts put method the marked.. route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into the db for one item that matches the passed in item from the main js that was clicked on
        $set: {
            completed: false //sets complete status to false
          }
    },{
        sort: {_id: -1},//moves item to bottom of the list
        upsert: false //stops insertion if item doesnt exist
    })
    .then(result => {//starts a then if update succeeds 
        console.log('Marked Complete')//logs string
        response.json('Marked Complete')//responds with json to sender
    })
    .catch(error => console.error(error))//catches errors

})

app.delete('/deleteItem', (request, response) => {  // starts delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //look inside the todos collection for the one itme that has a matching name from the js file
    .then(result => { //starts a then if delete succeeds 
        console.log('Todo Deleted')//logs string
        response.json('Todo Deleted')//responds with json to sender
    })
    .catch(error => console.error(error))//catches errors

})

app.listen(process.env.PORT || PORT, ()=>{ //says to use the port we chose but if it doesnt work  can choose one for us
    console.log(`Server running on port ${PORT}`)//logs string
})