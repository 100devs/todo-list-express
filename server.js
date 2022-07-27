//setting up all the constants for the server to run
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//declaring our database variables; processing the key_string from the .env file so that it is used to connect
// to the mongoDB database; passing the nae of the db so we can connect to it
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo-list'

//calling the connect method on the MongoDB client adn passing the key so that we can connect to our DB;
//after the promise is resolved we either then define our db variable via out connection to the MongoDB server
//Now we're able to interact with the database through the db variable
//set a .catch to log errors if any exist
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch(err=> console.log(`There's a problem Doc ${err}`))

//setting up compatability for the server to render ejs files
app.set('view engine', 'ejs')
// Setting up the ability for the server to serve up any static files form the public folder e.g. css etc.
app.use(express.static('public'))
//express.urlencoded middleware allows us to parse data from url
app.use(express.urlencoded({ extended: true }))
//express.json() allows us to parse income data as json
app.use(express.json())

//setting up the first 'get request' router. We're serving up the page and setting variables for the todo list and itemsLeft to do and making a request from the database to see what data is there.
//the data from the collection titled 'todos' are imported in a response from the database and then rendered in the ejs file
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//Sending a post request. Post request is received, we check the database collections, find the collection 'todos' and if it doesn't exist it is created.
// We parse the request body from the input element in the ejs with the 'name' attribute of todoItem
//when the promise is resolved we log the todo as added in the console then redirect to the homepage;
//else we log the errors
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


//The put request comes through a fetch request made on the client side javascript, as event listeners are listening for the clicks on the text to mark them as done.
//All put requests are passed to the server with the key itemFromJS: and the value.
//We take the value and pass it to the db.collection to update that specific entry in the collection.
// we use the $set: {
//     field: value
// } to update/change the completed 'field' for each entry in the collection. When a text is clicked this put
// request is triggered and a boolean value of true is passed to the field of completed.
// this triggers a change in styling via the CSS of a line through, as the completed boolean will create add the class 'completed to the element'
// next the strings are in a descending order by their MongoDB ids via the sort() cursor: -1 is descending order
// 1 is ascending; the upsert option adds it if it's not there, not necessary for us in this app.
// log the marked complete and send json response
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//this is similar to the above, again another click event registered in the client-side js then the boolean value for completed is reversed i.e. to false and he CSS rules subsequently changed.
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//The delete request is triggered by the client-side js. When requested teh db.collection is searched and the 
//deleteOne method is called to delete a single item, the item is passed in ({})
//The request is logged as successful or else an errors is logged as per the other promises above
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//finally app.listen sets what port we're going to be hosting our server on; here we have two possibilities:
//the local one set at the top of the doc or the host set by the local environment e.g. the cloud service provider e.g. Heroku's specific port etc. Then we log the server is live
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})