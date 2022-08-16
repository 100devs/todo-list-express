const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
//Defining the files needed for the app to work, we are grabbing dependencies from the internet and placing them into the node_modules folder
// as well as setting up the variables of our express function to app and the PORT


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
//Defining the MongoDB connection string, that is used to link to the mongoDB, as well as the collection name we are using to place our to do items
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    .catch(err=>console.error(err))
//Connecting to the MongoDB and checking if it connects by console logging the collection name
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//Setting up the middleware, where we bits of information and data is transformed in a way that lets the server/app use the data

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
//The first CRUD method that is used to render what we see.
    //It defines const variables of toDoItems, which grabs the collection of todos from the mongoDB, and makes it into an array
    //the itemsLeft is are the objects in the todos collection with the specific condition of completed: false
        //then renders index.ejs with two variable being sent to it, todoItems as items, and itemsLeft as left


app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
.catch(error => console.error(error))
})
//The second CRUD method that allows us to post/create something.
    //It has the path  of /addTodo, so whatever sees the post /addTodo will be creating something
    //It as a promise, where we locate the db collection of 'todos' and insertOne, which is a mongoDB function, where we insert an object that contains two properties: thing, which is the request.body.todoItem. We get this from the form inside the index.ejs. The next property we have is the completed false. Since we are passing in a new todo, then the completed by default should be false.
        //since this is a promise then we use a then/catch, which is the standard for promises
            //in the .then, we console.log todo added to confirm the mongoDB action and redirect back to the GET method to 'refresh' the page
            //in the catch is to simply just console log the error.


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
//The next CRUD method is the put method. Which is just simply updating a mongoDB object with the updateOne function
    // The function specfically looks for the collection of 'todos' and updatesOne with the object of thing, which is the request.body.itemFromJS. itemFromJS is simply a attribute we get from index.ejs,
        //We use $set to simply change the property of completed to true, which is false orignally. Since this is just updating the Object to essentially be 'completed'
        //sort is used to sort them in desc order
        //upsert is used to create a new object if the object in question cannot be found, we set it to false since we dont' want that
    //since its a promise we then use a then/catch
            //.then has a console.log of marked complete and a response . json of marked complete


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
        console.log('Marked Uncomplete')
        response.json('Marked Uncomplete')
    })
    .catch(error => console.error(error))

})
//The next CRUD method we find is another put method, so we are just updating the object again, specifically the completed property to false, since it was orignally false. 
    //we are using the same process of using the db collection of 'todos' and mongodb function of updateOne, where we use the object property of request.body.itemFromJS, and the settings of $set of completed false, sort as desc, and upsort:false so we dont create a new object if we dont find it 
    // a /then catch to print out marked uncomplete and response markedn uncomplete, a catch error 


app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//The next CRUD method is the delete method, where we simply are just deleting something
    //We look for the collection of 'todos' and use the mongoDb function of deleteOne, where we delete the specific thing of request.body.itemFromJS
    //Then we have a then/catch we just console log and response.json Todo Deleted
        //A catch to console.log any possible errors


app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
//The last CRUD method where we essentially just turn on the server and console.log if it is turned on at a specific port