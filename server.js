const express     = require('express')              //Requiring express so we can use it in our server after npm install express
const app         = express()                       //Declaring express as variable app so we can use it quickly
const MongoClient = require('mongodb').MongoClient  //Assigning our require to MongoClient after npm install mongodb
const PORT        = 2121                            //Declaring which port our server will run on
require('dotenv').config() //Requiring our dotenv folder so we can hide environment variables

//Declaring db variable so less typing (currently empty), connect to our database "todo"
let db,
    dbConnectionStr = process.env.DB_STRING, //accessing DB_STRING from our environment variable
    dbName = 'todo' // assigning our database name to be held in a data bucket
//
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to database using string above, opt in for new version of MongoDB connection (stays active) for better performance
    .then(client => { //after connectiong -> do function
        console.log(`Connected to ${dbName} Database`) //let us know we connected successfully
        db = client.db(dbName) // to this database we are now assigning from line 8
    })
    
app.set('view engine', 'ejs') //set the options for the express app we assigned earlier
app.use(express.static('public')) //middleware - to access our public folder when there are routes (index.html, styles.css, etc)
app.use(express.urlencoded({ extended: true })) //middleware - some setting
app.use(express.json()) //middleware - more settings to send json


app.get('/',async (request, response)=>{ //http method to handle requests and responses for our 'route' -> determine what to send back
    const todoItems = await db.collection('todos').find().toArray() //wait for database to reply; convert the documents from database into an array...wait for this to finish
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //wait for db to reply, count how many todos have not been completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // send the following items through our template: completed and not completed items
    // db.collection('todos').find().toArray() -> find todos
    // .then(data => { -> then do the following with the data
    //     db.collection('todos').countDocuments({completed: false}) -> count data from documents that are false
    //     .then(itemsLeft => { -> with those items we grabbed
    //         response.render('index.ejs', { items: data, left: itemsLeft }) -> send what we have left to do
    //     })
    // })
    // .catch(error => console.error(error)) -> handle errors if our promise fails, print in console
})

app.post('/addTodo', (request, response) => { //http method to create/update
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert a todo item into our database, send the raw data from body info in todoItem
    .then(result => { //do the following with our data if our promise fulfills
        console.log('Todo Added') //print update success message if our promise fulfills 
        response.redirect('/') //redirect or refresh the page
    })
    .catch(error => console.error(error)) // handle errors if our promise fails, print in console
})

app.put('/markComplete', (request, response) => { // create a new resource to update completed todoItems
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //access our todos collection, update a specific item by grabbing info from the body of the request 
        $set: {
            completed: true //mark as complete
          }
    },{
        sort: {_id: -1}, //descending sort by id 
        upsert: false //mix of update/insert - if theres nothing to update it'll insert -> 
    })
    .then(result => {
        console.log('Marked Complete') //print that our promise fulfilled
        response.json('Marked Complete') //respond to let the client know it worked
    })
    .catch(error => console.error(error)) // handle errors if our promise fails, print in console

})

app.put('/markUnComplete', (request, response) => { // update documents to be "uncomplete"
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //access our todos collection, update a specific item by grabbing info from the body of the request 
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // descending sort by id
        upsert: false //mix of update/insert - if theres nothing to update it'll insert -> 
    })
    .then(result => { //set up result in case we want to use it later
        console.log('Marked Incomplete') //print if promise fulfills
        response.json('Marked Incomplete') //let client know if promise fulfilled
    })
    .catch(error => console.error(error))// handle errors if our promise fails, print in console

})

app.delete('/deleteItem', (request, response) => { //delete an item from our db
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // delete that particular item
    .then(result => { //result in case we want it later
        console.log('Todo Deleted') //print to console if our promise fulfills
        response.json('Todo Deleted')// send to client if promise fulfilled
    })
    .catch(error => console.error(error))// handle errors if our promise fails, print in console

})

app.listen(process.env.PORT || PORT, ()=>{ //listen to which server our port is running on - first is for heroku to access their own port, otherwise access the port we declared above
    console.log(`Server running on port ${PORT}`) //let us know when we're connected to port, print it in console
})