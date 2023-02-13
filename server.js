const express = require('express')//setting a constant that allows the use of express on this file
// const app = express()setting the constant app to contain the instance of express
const MongoClient = require('mongodb').MongoClient //setting a constant to use the associated methods to access database.
const PORT = 2121 //sets the const port to 2121 being where the server will listen from
require('dotenv').config()//allowfor the storage of variables in the .env file


let db, //declaring a variable of db
    dbConnectionStr = process.env.DB_STRING,  //declaring a variable and putting the connection string in the env file into it.
    dbName = 'todo'  //declaring the db variable a name of todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to mongodb database using the dbConnectionString  and turn on unified topology to opt in to using the MongoDB driver's new connection management engine. (LOL HAHA)
    .then(client => { //waiting for connection, then if successful pass in the client information
        console.log(`Connected to ${dbName} Database`) //pass in the data base name (todo) and console log.
        db = client.db(dbName) //assigning a value to db that contains a db client factory method.
    }) //close the then
    
app.set('view engine', 'ejs') // sets ejs as the default render method.
app.use(express.static('public')) //sets the location of static assets
app.use(express.urlencoded({ extended: true }))//tells exoress to decode and encode urls where the header matches the content. supports arrays and objects
app.use(express.json())// parses json content (replaces body parser?)


app.get('/',async (request, response)=>{// sets a get method when the root ('/') is passed in and sets req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits all items form the todos colleciton
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of uncompleted item to later display in EJS
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//renders EJS file and passes in an object containing todo items and items left to complete.
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {//start create method listeneing from addTodo route that came from the form in the EJS and sets req and res parameters
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//in the mongo todo DB add andther item/ object with a properties of thing and completed and values of the todoitem from the ejs form and false.
    .then(result => { // if the above works then....
        console.log('Todo Added')//...console log todo added
        response.redirect('/')//refresh back to the root
    })//close then statment 
    .catch(error => console.error(error))//if the code above doesnt work throw the error 
})//close catch

app.put('/markComplete', (request, response) => {//sets a put method with the markComplete route and sets up req and res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//looks in the database for a name that matches the item that was clicked on. 
        $set: {//and set
            completed: true//completed to true
          }
    },{
        sort: {_id: -1},//moves item to bottom of list
        upsert: false //prevents insertion 
    })
    .then(result => { //opens then statement and sets result parameter. if above code runs successfully...
        console.log('Marked Complete')//console log marked complete
        response.json('Marked Complete')//sending response back to sender
    }) //closing .then
    .catch(error => console.error(error))//catching errors

})//closing put

app.put('/markUnComplete', (request, response) => { //begin put method via the markUnComplete route and set req/ res parameters
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //looks in the database for a name that matches the item that was clicked on 
        $set: {//and set
            completed: false //completed to false
          }
    },{
        sort: {_id: -1}, //move items to the bottom of the list
        upsert: false//prevents insertion
    })
    .then(result => { // opens then statement and sets result parameter. if above code runs successfully...
        console.log('Marked Complete')//console log marked complete 
        response.json('Marked Complete')//send response back to sender
    })//close then statement 
    .catch(error => console.error(error))//if above code is unsuccessful throw the error

}) //close put method

app.delete('/deleteItem', (request, response) => {//begin delete method via the deleteItem route and set req and res parameters
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//look in database for a name that matches the item clicked on 
    .then(result => { //then if above code is successful
        console.log('Todo Deleted')//console log todo deleted
        response.json('Todo Deleted')//send response back to sender
    })//close then
    .catch(error => console.error(error))//if above code is unsuccessful throw the error

})//close delete method

app.listen(process.env.PORT || PORT, ()=>{ //setting up which port we'll be listeneing on either the port from env file or the port we set
    console.log(`Server running on port ${PORT}`) //console log the running port
})//close listen