const express = require('express') //making it possible to use express in this file
const app = express() //setting a variable of app to the instance of express (means we can use the word app to set up the expres methods)
const MongoClient = require('mongodb').MongoClient //mopndoDB is the place we are storing data, mongoClient is the way in which we communicate with mongoDB allowing us to use certain methods. MongoClient is also a class
const PORT = 2121 //setting the constant of the port of the location to where our server will be listening (this is where you can view the app on the local machine)
require('dotenv').config() //allows us to look for access variables within the .env file


let db, //declaring a variable that is global so we can use it wherever in the code
    dbConnectionStr = process.env.DB_STRING, //decalaring a variable and assinging it to the database connection in the .env file means cleaner code throughout
    dbName = 'todo' //setting the name of the database 
    //within mongo db you have a cluster with databases with collections and then documents within them 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //creating a connection to mongoDB and passing in our connection string, also passing in another property (dont know what it does but s fairly standard thing to do)
    .then(client => { //MongoClient is establishign a promise and the .then will run if the connection is successful. also passing in all the client information
        console.log(`Connected to ${dbName} Database`) //console logging the template literal with the dbName (todo)
        db = client.db(dbName) //assigning a value to the db variable to contains lots of the information from the database.
    }) //closing the .then
    
//this block is middleware which allows us to open the communication channels with our requests
app.set('view engine', 'ejs') //setting ejs to the default render method
app.use(express.static('public')) //sets the location of the static files such as the stylesheets and main.js
app.use(express.urlencoded({ extended: true })) //tells express to decond and encode URLSs where the header matches the content. Supports arrayas and objects
app.use(express.json()) //helps us parse json content. used to be a seperate thing (bodyParser) but now built into express  


app.get('/',async (request, response)=>{ //(get is a CRUD read request), setting the / route to be the root which would be triggered by a first time load or refresh. starting a async function with 2 parameters 
    const todoItems = await db.collection('todos').find().toArray() //setting a variable amd then starting an await which is getting all documents from the collections of todos and converting it to an array 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //settign a variable to await to count of documents with the completed property of 'false' to display later in ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //settign the response to render the index.ejs and passing through todoItems and itemsLeft inside an object

    //this is a different way of writing it using promises instead of asyncy await
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //express post method (CRUD create) which will only trigger when the /addTodo route is used. This would be triggered by the form compeltetion in the ejs
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // saying looking into the database and find the collection called todos, it is then inserting an new item (object) with the contents of thing and completed. thing is a request into the body of the input fro the user so it gets the text of the task out. completed is set to false because new tasks are set to default so they have no .completed styling 
    .then(result => {//if the previous section was successful then it will produce this result in the next lines
        console.log('Todo Added') //console log text
        response.redirect('/') //redirects to the root route on the server so the item isnt submitted twice. redirects to the homepage
    }) //closing the .then method
    .catch(error => console.error(error))// catching any errors and console logging the erros
}) //ending the post

app.put('/markComplete', (request, response) => { // starting an express put method (CRUD update) when the /markComplete method is used
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //look into the database for one item matching the name passed in from the main.js file after it has been clicked on. if multiple tasks of the same name are used only the first item would be deleted, this is why it would be better to used id's instead,
        $set: {
            completed: true //setting the completed status to true 
          }
    },{
        sort: {_id: -1}, //moves item to the bottome nf the list, these arent really needed
        upsert: false //prevents insertions if item does not already exist 
    })
    .then(result => { //opening a .then if update was successful
        console.log('Marked Complete') //console logs the text
        response.json('Marked Complete') //sending response back to the server
    }) // closing .then
    .catch(error => console.error(error)) //console lkogging errors

}) //closing the put

app.put('/markUnComplete', (request, response) => {// starting an express put method (CRUD update) when the /markUnCmplete method is used
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{//look into the database for one item matching the name passed in from the main.js file after it has been clicked on. if multiple tasks of the same name are used only the first item would be deleted, this is why it would be better to used id's instead,
        $set: {
            completed: false //setting the completed status to false 
          }
    },{
        sort: {_id: -1},//moves item to the bottome nf the list, these arent really needed
        upsert: false //prevents insertions if item does not already exist 
    })
    .then(result => { //opening a .then if update was successful
        console.log('Marked Complete')//console logs the text
        response.json('Marked Complete')//sending response back to the server
    }) // closing .then
    .catch(error => console.error(error)) //console lkogging errors

}) //closing the put

app.delete('/deleteItem', (request, response) => { //starting an express method (CRUD deletay) with the path /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //looking into the database into the todos collection and finding the one item that has a matching name from the js file and then deleting it
    .then(result => { //if the delet was sucessful we start a .then
        console.log('Todo Deleted') //console log the text
        response.json('Todo Deleted') ////sending response back to the server
    }) //closing .then
    .catch(error => console.error(error)) //catching errors and console logging

}) //closiung the delete

app.listen(process.env.PORT || PORT, ()=>{ //setting up whcih port we will be listening on either from the .env file or from the PORT value set at the top of the document
    console.log(`Server running on port ${PORT}`) //console log the running port
}) //closing the port