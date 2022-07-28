const express = require('express')
// declares express as requirment  and lets server use it
const app = express()
//declares constant app to be express called
const MongoClient = require('mongodb').MongoClient
// declares MongoClient as requirement and lets server use it
const PORT = 2121
// declares port that the server will run on
require('dotenv').config()
// requires dot env, allows us to use environment variables locally


let db,
// begins several declarations and assignments, one for db which is not assigned yet
    dbConnectionStr = process.env.DB_STRING,
// dbConnectionStr is assigned to the environment variable connection string used to connect to our mongoDB database without exposing it to the end user
    dbName = 'todo'
// declares and assigns dbName database name to be 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// connects to mongoDB, method on mongoclient object, useUnified topology makes it work modern, takes db connection string to connect to the right mongo db database
    .then(client => {
// runs once connect resolves, does client arrow function
        console.log(`Connected to ${dbName} Database`)
// console logs the database we are connected to
        db = client.db(dbName)
// assigns db to client db, assigns the db to a simple variable for use elswwhere
    })
//
    
app.set('view engine', 'ejs')
// sets the rendering engine for our html as embedded java script
app.use(express.static('public'))
// allows us to use the magic public folder to deliver up whatever we need from the server
app.use(express.urlencoded({ extended: true }))
// based on body parser, allows us to use 
app.use(express.json())
// allows use of json parsing middleware included with express, based on body parser


app.get('/',async (request, response)=>{
// on the base route, runs asynchronous function
    const todoItems = await db.collection('todos').find().toArray()
// declares todoItems as promise of database collection todos (all elements) converted to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// declares itemsLeft as promise of database collection todos (all elements which fulfill the completed: false object behavior --magic) converted to an array
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
// renders the response via index.ejs feeding in todo items and items left arrays within an object so that ejs can pull them out and use them
    // db.collection('todos').find().toArray()
// this would be the non express way to do this, take todos and make into an array
    // .then(data => {
// take that and do this to it
    //     db.collection('todos').countDocuments({completed: false})
// count the ones left to do
    //     .then(itemsLeft => {
// then once that is resolved, take items left
    //         response.render('index.ejs', { items: data, left: itemsLeft })
// and render that stuff through index.ejs
    //     })
// close the .then off
    // })
// close the enclosing .then off
    // .catch(error => console.error(error))
// is fails, run catch,  error and console log error
})
// closes out the get for the root route

app.post('/addTodo', (request, response) => {
// post ie create, on route addtodo, as gotten from action in the form in index.ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
// add a document (ie object) to the todos collection in the db, with the name as contained in the request body (name value/content from form) as the thing and completed as false
    .then(result => {
// now do the thing to the result
        console.log('Todo Added')
// log todo added in the console
        response.redirect('/')
// refresh the page by redirecting to the root route
    })
// close the then off
    .catch(error => console.error(error))
// console log the error if rejected
})
// close out the post request

app.put('/markComplete', (request, response) => {
// open the put (update) request on the markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// go to todos collection in database and update the one document fulfilling thing in object, request.body.itemFromJS -- ie the item gotten from client side JS, then do the comma separated thing to it
        $set: {
// modify the document
            completed: true
// modify completed to be true in the selected document
          }
// close out set modification
    },{
// close out the first update doing, open next parameter going into the put
        sort: {_id: -1},
// sort collection by id property in descending order
        upsert: false
// don't update and insert the document contianing thing: request.body.itemFromJS if it doesn't already exist
    })
// close out sort/ no upsert
    .then(result => {
// then do this!
        console.log('Marked Complete')
// log marked complete to console
        response.json('Marked Complete')
// json the response as marked complete
    })
// close out the then
    .catch(error => console.error(error))
// cath that error and console log it when stuff is rejected or not fulfilled

})
// close out that put request

app.put('/markUnComplete', (request, response) => {
// open the put (update) request on the markUnComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
// go to todos collection in database and update the one document fulfilling thing in object, request.body.itemFromJS -- ie the item gotten from client side JS, then do the comma separated thing to it
        $set: {
// modify the document
            completed: false
// modify completed to be false in the selected document
          }
// close out set modification
    },{
// close out the first update doing, open next parameter going into the put
        sort: {_id: -1},
// sort collection by id property in descending order
        upsert: false
// don't update and insert the document contianing thing: request.body.itemFromJS if it doesn't already exist
    })
//
    .then(result => {
// do this next!
        console.log('Marked Complete')
// log marked complete to the console
        response.json('Marked Complete')
// parse response as json with marked complete inside
    })
// close out the then
    .catch(error => console.error(error))
// catch that error if the  fails or stuff is rejected, and console log that error

})
// close out the update request (put)

app.delete('/deleteItem', (request, response) => {
// open the delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
//  go to db collection named todos and delete the one matching thing: request.body.itemFromJS ie item from js ie item from DOM
    .then(result => {
// then do the thing below
        console.log('Todo Deleted')
// log todo deleted to the console
        response.json('Todo Deleted')
// parse response as json with todo deleted inside
    })
// close out the then
    .catch(error => console.error(error))
// catch that error if the  fails or stuff is rejected, and console log that error

})
// close out the delete request

app.listen(process.env.PORT || PORT, ()=>{
// tells server to listen for on and either run on the port provided by the end (heroku?) or the PORT we defined as a variable
    console.log(`Server running on port ${PORT}`)
// log to the console the port that the server is running on
}) 
// close out the app port listening