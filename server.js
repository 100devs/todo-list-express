const express = require('express') //requires the express package
const app = express() // init's that express package
const MongoClient = require('mongodb').MongoClient //requires mongodb
const PORT = 2121 //sets port to execute
require('dotenv').config() //holds secret variables like mongodb keys or tokens, exists outside of code (ignored in gitignore)


let db, //establish some vars
    dbConnectionStr = process.env.DB_STRING, //secret db string to connect to it
    dbName = 'todo' //name of db

// Mongo API code to connect to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
// Unified Topology = keeps open watch on the connection to make sure the data is ready. More efficient but not as stable yet. Mom has a pants.
    .then(client => { // after connecting, then...
        console.log(`Connected to ${dbName} Database`) // log that we're connected
        db = client.db(dbName) // take client, connect to database, set it to this var
    })

app.set('view engine', 'ejs') // set the settings for the express app we assigned earlier
app.use(express.static('public')) // middleware - look in public folder for routes we call up later, btwn call/response
app.use(express.urlencoded({ extended: true })) //setting
app.use(express.json()) //setting

// NOTE: The async makes sure the response ONLY sends when the response actually exists
app.get('/',async (request, response)=>{
    // const todoItems = await db.collection('todos').find().toArray()
    // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()   /* went to the todos collection in the database, we put all the docs into an array */
    .then(data => {  /* data is an the array of documents in the database */
        db.collection('todos').countDocuments({completed: false})  /* counting docs that are false / filtering */
        .then(itemsLeft => { /* sending only the items left back */
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { /* whenever there is a post request  */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) /* add a new item/doc to our todo list on db; insert in the body of the todoItem and automatically set it to false for completed */
    .then(result => {
        console.log('Todo Added') //let us know we successfully added a todo
        response.redirect('/') //go back to the route screen
    })
    .catch(error => console.error(error)) // we got an error and console log the error
})

app.put('/markComplete', (request, response) => { //update some things in our db
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{  //change the todo
        $set: {
            completed: true // mark it as complete
          }
    },{
        sort: {_id: -1},  // sort by id and set the order to be descending; newest to oldest; order the items in the db
        upsert: false //update + insert = upsert; do not upsert
    })
    .then(result => { // then respond to the client
        console.log('Marked Complete') // let us know it worked
        response.json('Marked Complete') // let the client know it worked
    })
    .catch(error => console.error(error)) // if there is an error, console log the error

})

app.put('/markUnComplete', (request, response) => { // update our docs in the DB round 2
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // change one item
        $set: {
            completed: false // set as not completed
          }
    },{
        sort: {_id: -1}, // sort by id: this guy goes last
        upsert: false // don't update/insert at same time, don't add a double
    })
    .then(result => {
        console.log('Marked Complete') // let us know it worked // TYPO: Should be uncomplete
        response.json('Marked Complete') // let the client know it worked
    })
    .catch(error => console.error(error)) // catch errors

})

app.delete('/deleteItem', (request, response) => { // delete item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete one item from todos
    .then(result => {
        console.log('Todo Deleted') // print result like before
        response.json('Todo Deleted') // let the client know it worked
    })
    .catch(error => console.error(error)) //catch error

  })

app.listen(process.env.PORT || PORT, ()=>{  // run on this port; if there is no port set in the enviroment (like heroku), use the port we declared
    console.log(`Server running on port ${PORT}`) // log that we are listening when this executes
})
