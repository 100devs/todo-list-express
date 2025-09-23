const express = require('express') //variable to hold express being required
const app = express()//variable app to hold express 
const MongoClient = require('mongodb').MongoClient //variable to say the client is mongodb
const PORT = 2121 //especifying the port for server to listen
require('dotenv').config() //tells the server .env is being used


let db, //setting a global variable to hold database as db
    dbConnectionStr = process.env.DB_STRING, //connection string being process using .env using the DB_STRING variable
    dbName = 'todo' //setting database name to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //sets the conection string off database to connect to mongodb
    .then(client => { //mongo client returns a promise after the promise is resolve we store response as client
        console.log(`Connected to ${dbName} Database`) //console log connected to the name of database
        db = client.db(dbName) //assigning database variable db to hold client method
    })

//middleware    
app.set('view engine', 'ejs') //set express to render using EJS
app.use(express.static('public')) //set static files inside public folder
app.use(express.urlencoded({ extended: true })) //tells express to use urlencoded decode and encode URLS
app.use(express.json()) //tells express to parse JSON content


app.get('/',async (request, response)=>{ //set the route to the read request as the root / and async the response
    const todoItems = await db.collection('todos').find().toArray() //variable to hols array that awaits all to dos on collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //variable that holds all to dos not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //tells the response to render index.ejs with object of items not completedm

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //specify the route /addTodo to POST
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //tells the database to insert one document into the todos collection with the to do item as thing and completed set to false
    .then(result => { //if successful
        console.log('Todo Added') //log to the console todo added
        response.redirect('/') //redirect to the root
    })
    .catch(error => console.error(error)) //logs any errors
})

app.put('/markComplete', (request, response) => { //set the put UPDATE route as /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //we grab collection todos and update the one we click
        $set: {
            completed: true //we update the completed tag to true
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion of item if item does not already exist
    })
    .then(result => { //when we get a successful result 
        console.log('Marked Complete') //log to the console marked complete
        response.json('Marked Complete') //sending response to sender with string marked complete
    })
    .catch(error => console.error(error)) //logs any errors

})

app.put('/markUnComplete', (request, response) => { //we specify the route to put (UPDATE) as /markUncomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //grab from collection todos and update one clicked
        $set: {
            completed: false //sets the completed as false
          }
    },{
        sort: {_id: -1}, //moves item to the bottom of the list
        upsert: false //prevents insertion of item if item does not already exist
    })
    .then(result => { //when we get a successful result 
        console.log('Marked unComplete') //logs marked complete
        response.json('Marked unComplete') //sending response to sender with string marked unComplete
    })
    .catch(error => console.error(error)) //logs any errors

})

app.delete('/deleteItem', (request, response) => { //set the delete route to /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //we go to todos collection and delete one we clicked
    .then(result => { //when we get a successful result 
        console.log('Todo Deleted') //we log todo Deleted
        response.json('Todo Deleted') //sending response to sender with string marked Todo Deleted
    })
    .catch(error => console.error(error)) //logs any errors

})

app.listen(process.env.PORT || PORT, ()=>{ //we tell the server to listen a specific port from variable PORT or from the .env file
    console.log(`Server running on port ${PORT}`) //log the server is running on what port
})