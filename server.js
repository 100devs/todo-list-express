const express = require('express')//making it possible to use express in this app
const app = express()//saving the express() call as a variable called app
const MongoClient = require('mongodb').MongoClient//setting a variable MongoClient to help us connect to database. mongodb is the database, mongoclient is what lets us talk to it. this line makes it possible to use methods associated with mongoclient. mongoclient is capitalized because it's a class
const PORT = 2121//setting a constant to define a a location where our server will be listening
require('dotenv').config(//allows us to look for and access variables inside our .env file


let db,//globally declaring a variable called db, so we can use it in multiple places, but not assigning a value
    dbConnectionStr = process.env.DB_STRING,//look in env for db_string, declare a variable and assign it to that string
    dbName = 'todo',//declaring a variable to set a name for our database.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//creating a connection to mongoDb and passing in our connection string. we are also passing in an additional property
    .then(client => {//we're using then since mongoclient returns a promise. waiting for the connection and proceeding if successful. passing in all the client information
        console.log(`Connected to ${dbName} Database`)//log the name of database we're connected to
        db = client.db(dbName)//assigning a value to a previously declared db variable that contains a db client factory method
    })//closing our .then
    

//middleware (helps facilitate communication for our requests)
app.set('view engine', 'ejs')//saying ejs is how we should expect our stuff to render
app.use(express.static('public'))//Sets the default folder for our static asssets to be our public folder. If we had a plain html file, it would also be in there. Photos, additional stylesheets would go in there.
app.use(express.urlencoded({ extended: true }))//Tells express to decode and encode URLs where the header matches the content. Extneded part suports arrays and objects. (???)
app.use(express.json())//Parses JSON content from incoming requests


app.get('/',async (request, response)=>{//handles a read request on our root route. starts a GET method when the root route is passed in. sets up req and res parameters
    const todoItems = await db.collection('todos').find().toArray()//sets a variable and awaits an array of all documents in the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits the number of documents in the todos collection whose completed property is set to false
    response.render('index.ejs', { items: todoItems, left: itemsLeft })//use our index.ejs file to render HTML, and in ejs 'items' will refer to the things we just defined as todoItems (all documents) and 'left' will refer to the thing we just defined as itemsLeft (the count of uncompleted items)

    //same thing but as a promise with .then:

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))

})//closes it

app.post('/addTodo', (request, response) => {//starts a POST method when the addTodo wrote is passed in, and sets up the parameters. this is triggered when the form whose action is /addTodo fires. (COOL NOTE: This bypasses our JavaScript entirely and acts entirely from the HTML, since forms can do that)
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})//Look in the todos collecton of the database and add an item with the value of the 'thing' property set to todoItem in the request body, which comes from the name of the form, and the value of its completed property is false

    .then(result => {///if insert is successful, do something
        console.log('Todo Added')//log to the console so they know what we did
        response.redirect('/')//redirect to our main route so it can make another get request which will now render html with more stuff in he collection
    })//closes our .then
    .catch(error => console.error(error))//if there's an error, log it
})//closes this post request

app.put('/markComplete', (request, response) => {//starting a PUT method when the markComplete route is passed in
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//go into our database and the todos collection and update the document whose value for the 'thing' property is set to itemFromJS, which we previously set to the innerText. so it's looking for a 'thing' property whose value is itemFromJS that we pass in and tries to update it. We prefer to look things up by their ID to avoid the issue where this would simply update the first one with that name, not necessarily the one we clicked
        $set: {
            completed: true//set completed status to true
          }
    },{
        sort: {_id: -1},//sort in descending order by ID but doesn't seem to do anything from playing around with it??
        upsert: false//a mix of insert and update: if the value didn't exist, we would create it. it's set to false to prevent insertion if item doesn't already exist.
    })//closes our set block
    .then(result => {//starting a then if update was successful
        console.log('Marked Complete')//logs that we completed it
        response.json('Marked Complete')//responding via json that we are. this is because in our main.js file, it's awaiting a response via json, so now it knows that we're done.
    })
    .catch(error => console.error(error))//if there's an error, log it to the console

})//closes our put method

//below: the same thing but now it uses the markUnComplete route to set it to 'false' instead of true

app.put('/markUnComplete', (request, response) => {//same
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//same
        $set: {
            completed: false//sets false instead of true!!!! otherwise, i'm not commenting here so i can specifiaclly note how this is the same
          }
    },{
        sort: {_id: -1},//same
        upsert: false//same
    })
    .then(result => {//same
        console.log('Marked Complete')//same
        response.json('Marked Complete')//same
    })//same
    .catch(error => console.error(error))//same

})//same

app.delete('/deleteItem', (request, response) => {//starts a delete method when the delete route is passed
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})//same mostly but now we use the deleteOne method to delete one thing
    .then(result => {//same
        console.log('Todo Deleted')//same
        response.json('Todo Deleted')//same
    })//same
    .catch(error => console.error(error))//same

})//same

//^note how much is the same! we're still searching by itemFromJS (usually much better to search by ID lol) but this time we're doing deleteOne instead of updating it.

app.listen(process.env.PORT || PORT, ()=>{//setting up which port we will be listening on. it'll either get the one out of the .env file (environment variable) or it'll use the hardcoded one. 
    console.log(`Server running on port ${PORT}`)//log which port we're running on
})//closes that 