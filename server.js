//This loads the express module, require is similar to import in other languages
const express = require('express')
// Calls the express function "express()" and puts new Express application inside 
//the app variable (to start a new Express application). It's something like you 
//are creating an object of a class. Where "express()" is just like class and 
//app is it's newly created object.
const app = express()
//This loads the mongodb package, and we use mongoClient to talk to mongo 
const MongoClient = require('mongodb').MongoClient
//Sets the port as a variable so we can use that going forward
const PORT = 2121
//we are going to use our env files 
require('dotenv').config()

//this all connects to the database   
let db,
    //enviroment variables are used instead of the mongo connection string 
    //the connection string is stored in the env file 
    //this is so the mongo conection string doesn't get pushed up to github
      
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        //this is the actual database that we are connected to    
        db = client.db(dbName)
    })
    
//we are using ejs as our templating language 
app.set('view engine', 'ejs')
//we are using our public folder to use all of our static files
app.use(express.static('public'))
//this does what body-parser does, we look at the requests coming through 
//and allows us to get the data/ text out of the requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//we are listening for a get request from the root route 
app.get('/',async (request, response)=>{
    //we are connecting to our database with db
    //we find the collection in our database called todos
    //find() returns all of the documents inside of the collection 
    //We then put all of those documents found into an array
    const todoItems = await db.collection('todos').find().toArray()
    //this gives us the number of documents that are not completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //we are passing the returned objects into the template/ejs 
    //We will not see todoItems, itemsLeft in the template 
    //we will see items and left
    response.render('index.ejs', { items: todoItems , left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//the route comes from the action on the form 
app.post('/addTodo', (request, response) => {
    //this allows us to see all the extra unimportant (to us) stuff
    //that is in the request, vs the body 
    console.log(request)
    console.log(request.body)
    //this takes the value from inside the input with the 'name' todoItem 
    //and puts it into the mongodb database with property completed: false
    //it connects to the database finds the collection called todos
    //and then adds it
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        //Once this is completed it refreshes the page with a get request
        //to the root, and now there will be an added item in the db
        //that will be added to the dom
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//our fetch in main.js had a method of put
//and a route of markComplete
app.put('/markComplete', (request, response) => {
    //itemFromJS was sent from main.js and refers to the text of the
    //item that was clicked in the dom
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //this will set completed to true for the clicked item
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        //If upsert is true and you try to update something that is not there
        //it will create the document for you
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        //THis response is sent to main.js 
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

//our fetch in main.js had a method of delete
//and a route of deleteItem
app.delete('/deleteItem', (request, response) => {
    //We go to our collection 'todos' and delete the document with
    //the 'thing' that matches the inner text of the span 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        //this responds back to client side (main.js )
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//were using our port, or once were on horoku we will use the environment variables
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})