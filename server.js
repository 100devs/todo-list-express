const express = require('express') 
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()   //using an ENV file for our sensitive information.

//setting up variables for MongoDB
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connecting to MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) //setting up the database name
    })
    
app.set('view engine', 'ejs')  //this allows us to use EJS through our program
app.use(express.static('public')) // this allows us to use the files in our public folder without needing the code
app.use(express.urlencoded({ extended: true })) //this allows us to attach the body of the form to the request
app.use(express.json()) // allows up to read JSON


//this is the root route and dispplays the main page, we are using the async/await syntax for our data
app.get('/',async (request, response)=>{
    //we declare a variable and assign it to the data in the todos collection. We have to access the collection, find the information, and then place those objects in an array
    const todoItems = await db.collection('todos').find().toArray()

    //this section access the DB and counts the number of documents that match the property {completed: false}. That number is now stored in the variable itemsLeft
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    //we now respond back the client, we render our data in our index.ejs file. the property items is passed in as an object and holds array of objects since ejs needs objects. It also take the property left and holds the number of items left.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //this sections was commented out when i cloned the repo, but it looks like the code we have above, but using .then method for our promises. 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//the root /addToDo matches the action from the form, this takes the forms data once submitted
app.post('/addTodo', (request, response) => {
    //the data is then placed in the collection 'todos' and having each collection item have the data in the property thing
    //we also hard coded completed and set it to false
    //request.body.todoItem match the name on the form
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    //then we take the promise that is return after the information is inserted
    .then(result => {
        console.log('Todo Added') // we then add to the console that an item has been completed
        response.redirect('/') // and once its completed, we want to refresh the page and do a get request to display the new data
    })
    .catch(error => console.error(error))
})


app.put('/markComplete', (request, response) => {
    //once we get the data from the fetch, we go to the collection and update one of the objects. We find the thing property, go in the body and grab the items innerText we click on. It finds the matched item,we set the completed property to true. Sort it and set upsert to false.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //once completed, we receive a promise back from the database.
    .then(result => {
        //console.log the action as complete and send a response back to the fetch on the client side in json.
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    //once we get the data from the fetch, we go to the collection and update one of the objects. We find the thing property, go in the body and grab the items innerText we click on. It finds the matched item,we set the completed property to true. Sort it and set upsert to false.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    //once completed, we receive a promise back from the database.
    .then(result => {
        //console.log the action as complete and send a response back to the fetch on the client side in json.
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

//we receive the data from the server, We go into the collection and deleteOne. We delete the thing that holds the same key we took from the innerText in the Fetch.
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //we wait from a promise from our database.
    .then(result => {
        // then log we deleted and item and we respond back to the fetch on the client side that we deleted an item in JSON.
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//listens to see if the server is running
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})