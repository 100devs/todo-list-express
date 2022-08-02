//This requires the express module and stores it within the express binding we're declaring
const express = require('express')
//This calls the express function in order to return an instance of an express application, which this app binding is intialized to
const app = express()
//This requires the mongodb module and intitializes the MondoClient bidning to the MongoClient object available to the MongoDb module
const MongoClient = require('mongodb').MongoClient
//This initializes our PORT variable to 2121, helping us to avoid magic numbers
const PORT = 2121
//This requires the dotenv module and configures it so that we can use the process.env.variableName onvention to reference out environemntal variables in our code, so that we can include the .env file within teh .gitignore file and not push any sensetive information to our public github repos
require('dotenv').config()

//This declates 3 variables, db, dbConnectionStr, and dbName, and initalizes dbConnectionStr to the value stored within process.env.DB_STRING and dbName to 'todo 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//This stores the connection to our database
//THe first argument of MongoClient.connect is the uri/string used to connect to our database
//The { useUnifiedTopology: true } argument  opts us in to using the MongoDB driver's new connection management engine. You should set this option to true, except for the unlikely case that it prevents you from maintaining a stable connection.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//if the connection is successful, the then method will store the client withing our parameter and we'll assign our db varabile the value of the client of our database and give it the name we've stored within out dbName binding
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//This sets our view engine name t othe value 'ejs' which sets ejs as our template engine
app.set('view engine', 'ejs')
//This enables our app to use express' static middelware function that serves static files (from within the folder we name 'public')
app.use(express.static('public'))
//This is a built in middleward function that parses incoming requests with urlencoded payloads. This causes our app to only parse url encoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }))
//This is a built-in middleware function in Express that parses incoming requests with json payloads. This returns middleware that only parses JSON and only looks at rquests where the Content-Type matches the type option
app.use(express.json())

//This routes HTTP requests to the '/' path with the specified callabck funtion
//By declaring async before our callback function, we are able to use the async-await synctactial sugar to make our asynchronous code look synchronous
app.get('/',async (request, response)=>{
    //This find our collection with a name of 'todos' and returns all todos (since no filter is specified) and then converts the returned object to an array
    const todoItems = await db.collection('todos').find().toArray()
    //This finds our collection with a name of todos, and returns a count of all documents within the collection where their completed prperty has a value of false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //response.render renders a view and send the rendered HTML string to the client
    //The second parameter, locals, takes in an object of local variables to pass to our view
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
//THis routes HTTP post requests to '/addTodo' and one that endpoint is hit, the callback function fires off
app.post('/addTodo', (request, response) => {
    //This inserts a documnet where the thing property is the todoItem sent within the request's body, and the completed property is false, then if this is successful we log 'Todo Added' to the console, and redirect users to the home page of our application
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    //This fires off in any errors happen within this method chain
    //Also, console.error outputs an error message to the console, and we pass the error stored within out error parameter/binding to this method in order to output the error's information to the console
    .catch(error => console.error(error))
})

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

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})