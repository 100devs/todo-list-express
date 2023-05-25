const express = require('express') //import express functionality and assign to variable so we can use it
const app = express() //assign express to app variable
const MongoClient = require('mongodb').MongoClient// import mongoclient functionalitity from mongodb package and assign to var
const PORT = 2121 // declaring global variable and assigning to it a port number for server listening
require('dotenv').config()//gives us the ability to get variables from .env files


let db, //declaring db variable
    dbConnectionStr = process.env.DB_STRING, //declaring var and assigning connectoion string from .env to it
    dbName = 'todo' //delcaring variable and assigning to it the document name of our database on mongodb

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connectiong to database by passing in connection string 
    .then(client => { //if/when connection works then do the following
        console.log(`Connected to ${dbName} Database`)//log to console template literal completed with dbName variable
        db = client.db(dbName)// assigning something to prevously declared var using dbclient's factory method
    })//closing .then

//middleware - provide all the in between stuff for https and such
app.set('view engine', 'ejs')// sets ejs as the rendering selection/method
app.use(express.static('public'))// sets location for static assets like images,stylesheets,html etc
app.use(express.urlencoded({ extended: true }))//tells express how to decode and encode urls to where header matches the content, supports objects
app.use(express.json())//provides functionality to parse json 


app.get('/',async (request, response)=>{ //sets event listener and action(async function) for when GET request for /root path is passed
    const todoItems = await db.collection('todos').find().toArray() //declares a variable and awaits then assigns an array consisting of all objects/documents in todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //declares a variable and awaits then assigns a count of documents/objects in collection that are not complete(where completed is false)
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//finally function responds to request with an ejs file and passing along with it an object that contains to properties assigned the previous variables

            //vv classic promises method of same action instead of async/await method vv
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})//close get event listener

app.post('/addTodo', (request, response) => {//sets event listener and action for when POST request for /addTodo path is passed
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})// finds the todos collection then adds a new document/object with the request body's text(name=todoItem) from clientside form as the the variable passed in-- the rest is hardcoded
    .then(result => { //if successful do the following...
        console.log('Todo Added')// log string
        response.redirect('/')//redirects client to root(refreshes)
    })//close then block
    .catch(error => console.error(error))// if rejected -> logs error to console
})//close event post listener

app.put('/markComplete', (request, response) => { //sets event listener and action for when POST request for /markComplete path is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// got to collection and find document that matches the clicked on text and...
        $set: { //update method??
            completed: true //set completed to true
          }
    },{
        sort: {_id: -1},// sets sorting by id to descending
        upsert: false  // prevents creaton if it doesnt exist 
    })
    .then(result => {//if upddate successful then...
        console.log('Marked Complete')//logs str to console
        response.json('Marked Complete')// responds to client with json string
    })
    .catch(error => console.error(error)) // if error exist or rejected take error and print to console

})//close put event listener

app.put('/markUnComplete', (request, response) => {//sets event listener and action params for a put request for when /markUnComplete path is passed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// got to collection and find document that matches the clicked on text and...
        $set: {//update method??
            completed: false //set completed to false
          }
    },{
        sort: {_id: -1},// sets sorting by id to descending
        upsert: false// prevents creaton if it doesnt exist
    })
    .then(result => {//if upddate successful then...
        console.log('Marked Complete')//logs str to console
        response.json('Marked Complete')// responds to client with json string
    })
    .catch(error => console.error(error))// if error exist or rejected take error and print to console


})

app.delete('/deleteItem', (request, response) => { //sets event listener and action params for a deletay request for when /deleteItem path is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // got to collection and find document that matches the clicked on text and delete it
    .then(result => { //then if connection succesful...
        console.log('Todo Deleted')//logs str to console
        response.json('Todo Deleted')// responds to client with json string
    })
    .catch(error => console.error(error))//if error exist or rejected take error and print to console

})

app.listen(process.env.PORT || PORT, ()=>{ // set server to listen on .env configured PORT if exists, otherwise listen on PORT declared globally in this doc
    console.log(`Server running on port ${PORT}`)//log to console template string with port in PORT
})