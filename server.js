const express = require('express')//Requiring epress package that we installed
const app = express() //initializing the package so we can use it
const MongoClient = require('mongodb').MongoClient //requiring the MongoDB and client in a variable so we can access it
const PORT = 2121 //PORT runs here (which is compatible with heroku)
require('dotenv').config() //holds secret things like variable keys (need to put them in heroku as variables)


let db, //shorten up variables so less typing (empty)
    dbConnectionStr = process.env.DB_STRING, //look here for the environmental variable connection string
    dbName = 'todo' // variable assignment

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to the database using string above unifiedTopolgy - opt in for a
//new version of MongoDB connection (stays active), better performance
    .then(client => { //after connecting then do (function)
        console.log(`Connected to ${dbName} Database`) //let us know we connected correctly
        db = client.db(dbName) //assign the db variable from line 8
    })
    
app.set('view engine', 'ejs') //set the options for the express app we assigned earlier
app.use(express.static('public')) //middleware - look in the public folder rotes we call up later; comes between request and response
app.use(express.urlencoded({ extended: true })) // settings
app.use(express.json())//more settings


app.get('/',async (request, response)=>{ //client request the 'route' page -> we send back these 
    const todoItems = await db.collection('todos').find().toArray()//wait for the database to reply; convert the documents from database into an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // wait for the databaase to reply; grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //show us the goods
    // db.collection('todos').find().toArray() -> find the todos put in array, only one connection here then filter them
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false}) -> find the number of not completed tasks
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft }) 
    //     })
    // })
    // .catch(error => console.error(error)) -> if we hit an error, let us know (second half of the try/catch)
})

app.post('/addTodo', (request, response) => { //update from the CRUD or create
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add a new item/document to our todo list on database; insert in the body of the todoItem and automatically set it to false for completed
    .then(result => { //
        console.log('Todo Added') //let us know that we successfully added a todo
        response.redirect('/') //go back to the route screen/homepage
    })
    .catch(error => console.error(error)) //uh oh, we got an error...here you go
})

app.put('/markComplete', (request, response) => { //update some parts of the documents on our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change the todo
        $set: {
            completed: true //mark it as complete
          }
    },{
        sort: {_id: -1}, //sort by id: descending biggest to smallest so it ends up last
        upsert: false //update + insert = upsert; updates the rendering so you don't double add stuff
    })
    .then(result => { //second do:
        console.log('Marked Complete') //let us know it worked
        response.json('Marked Complete') //let the client know it worked
    })
    .catch(error => console.error(error)) //if error shove it in the console log

})

app.put('/markUnComplete', (request, response) => { //update our documents round 2: fight the man
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change this one todo
        $set: {
            completed: false //we didn't actually do this todo so it's undone
          }
    },{
        sort: {_id: -1}, //sort by id: this guy goes last
        upsert: false //don't add a double
    })
    .then(result => { //sets up result in case we want to use it later but we don't use it now
        console.log('Marked Incomplete') //let us know it worked
        response.json('Marked Incomplete') //let client know it worked
    })
    .catch(error => console.error(error)) //problem...warning

})

app.delete('/deleteItem', (request, response) => { //deletayy an item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete that guy
    .then(result => { //again, result in case we want it later
        console.log('Todo Deleted') //it worked - to server
        response.json('Todo Deleted') //it worked - to client
    })
    .catch(error => console.error(error)) //oh no!!

})

app.listen(process.env.PORT || PORT, ()=>{ //this is where we listen to the PORT; first one is for heroku's set one or else use the one we declared on line 4
    console.log(`Server running on port ${PORT}`) //server let's us know we are connected
})