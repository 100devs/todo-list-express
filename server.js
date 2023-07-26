const express = require('express') //importing express
const app = express() //assigning express to a constant variable
const MongoClient = require('mongodb').MongoClient //importing MongoDB client to project
const PORT = 2121 //assigning port to a constant variable
require('dotenv').config() //enables use of env file


let db, //declaring database variables
    dbConnectionStr = process.env.DB_STRING, //assign connection string from value in env file
    dbName = 'todo' //assigning variable to database in MongoDB

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connects to MongoDB connection management engine
    .then(client => {//runs when connected to database
        console.log(`Connected to ${dbName} Database`) //verifying that you connected to database
        db = client.db(dbName) //assigning variable to database itself
    })
    
app.set('view engine', 'ejs') //setting ejs as the viewing engine
app.use(express.static('public')) //middleware for usign folder for static files
app.use(express.urlencoded({ extended: true })) //middleware for recognizing incoming request strings and arrays
app.use(express.json()) //middleware for recognizing incoming request as json objects


app.get('/',async (request, response)=>{//handling get request on root route 
    const todoItems = await db.collection('todos').find().toArray() //finding all documents in colleciton and storing them as objects in array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //counting completed documents that have been completed:false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//rendering todoItems to ejs file and setting context



    ////harder to read this way by using promises instead of async await////

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //addign new document to database using request body
    .then(result => { //runs when promise is resolved (when document is added to database)
        console.log('Todo Added') //confirmation
        response.redirect('/') //redirects back to root route
    })
    .catch(error => console.error(error)) //prints error if error appears
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updating document that meets criteria usign request body 

    //setting completed property
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1}, //sorts by descendign id order and chooses first one
        upsert: false //if no matching document found, no new document is inserted 
    })
    .then(result => {
        console.log('Marked Complete') //confirmation
        response.json('Marked Complete')//response when promise resolves
    })
    .catch(error => console.error(error)) //prints error if rejected

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//updating document that mets criteria using request body

        //setting completed propery to false
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, //sorts by descending id order and chooses first one
        upsert: false //if no matching document found, no new document is inserted 
    })
    .then(result => {
        console.log('Marked Complete') //confirmation 
        response.json('Marked Complete') //reponse when promise resolves
    })
    .catch(error => console.error(error)) //prints error if rejected.

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})// delete document that meets criteria using request body 
    .then(result => {
        console.log('Todo Deleted') //confirmation
        response.json('Todo Deleted') //response when promise resolves
    })
    .catch(error => console.error(error)) //prints error if rejected

})


//tells server what port to run in using declared PORT variable
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) //confirmation
})