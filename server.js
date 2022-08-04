const express = require('express') /* adds express to the packages */
const app = express() /* saves the express method from the express package so you don't thave to keep typing it over and over */
const MongoClient = require('mongodb').MongoClient /* allows access to mongodb methods in the MongoClient */
const PORT = 2121 /* local port that the server can run on as backup */
require('dotenv').config() 


let db,
    dbConnectionStr = process.env.DB_STRING, /* mongo db database secrets. Put in separate env file for privacy */
    dbName = 'todo' /* name of the database */

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`) /* lets you know when you connect */
        db = client.db(dbName) /* saves specific database name into the db variable for easy access later */
    }) /* connect to database so that you can access and edit the documents in the collection */
    
app.set('view engine', 'ejs') /* sets the rendering to be ejs */
app.use(express.static('public')) /* lets the program know that the utility files are in the public folder (css & js files) */
app.use(express.urlencoded({ extended: true })) /*  */
app.use(express.json()) /* sets file format to be json for requests & responses to the server */


app.get('/',async (request, response)=>{ /* this is what happens when a page is refreshed or the page is navigated to. */
    const todoItems = await db.collection('todos').find().toArray() /* Makes array of all of the documents in the todos collection */
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) /* totals number of incomplete items (completed: false) in database and saves them to itemsLeft */
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) /* the index.ejs file is rendered with the todoItems and itemsLeft variables and the resulting html file is sent to the browser */
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
    /* gets todo items from the database, and undone todo items and then uses these data to render the ejs file, which spits out an html file, which is then sent to the browser. */
})

app.post('/addTodo', (request, response) => { /* receives input from form data (when submit is clicked) */
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) /* finds the todo collection, and then inserts the text from the form, and marks it as incomplete */
    .then(result => {
        console.log('Todo Added') /* logs it as added in the console */
        response.redirect('/') /* the page is reloaded, but from an updated database */
    })
    .catch(error => console.error(error)) /* if something goes wrong, an error will appear in the console */
})

app.put('/markComplete', (request, response) => { /* when the item that is incomplete is clicked, this method will be triggered. The text of the item will also be sent over in the request.body */
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ /* the todo collection will be searched for the text in the request body */
        $set: {
            completed: true /* the completed field will be updated to true */
          }
    },{
        sort: {_id: -1}, /* moves item to bottom of list  */
        upsert: false /* prevents insertion if the item does not already exist  */
    })
    .then(result => {
        console.log('Marked Complete') /* logs the the task has been completed to the console */
        response.json('Marked Complete') /* responds to the browser with a json file that says 'Marked Complete */
    })
    .catch(error => console.error(error)) /* If any errors should occur, they will log to the console. */

})

app.put('/markUnComplete', (request, response) => {/* when the item that is complete is clicked, this method will be triggered. The text of the item will be sent over in the request.body to facilitate the following updates to the database*/
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false /* changes the completed status to false (item has not been completed) */
          }
    },{
        sort: {_id: -1}, /* moves the item to the bottom of the list */
        upsert: false /* prevents insertion if the item does not already exist */
    })
    .then(result => {
        console.log('Marked Complete') /* logs the the task has been completed to the console */
        response.json('Marked Complete')/* responds to the browser with a json file that says 'Marked Complete */
    })
    .catch(error => console.error(error))/* If any errors should occur, they will log to the console. */

})

app.delete('/deleteItem', (request, response) => {/* this method is triggered when the trash can is clicked. the request contains the /deleteItem method, plus the text next to the trash can (the todo item). */
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) /* the todos collection is searched and the document where the thing property matches the text from the request body is deleted */
    .then(result => {
        console.log('Todo Deleted') /* a notification that the item has been deleted is logged to the console. */
        response.json('Todo Deleted') /* the server sends a response to the browser that the todo has been deleted */
    })
    .catch(error => console.error(error))/* If any errors should occur, they will log to the console. */

})

app.listen(process.env.PORT || PORT, ()=>{ /* this specifies what port the server will send data to */
    console.log(`Server running on port ${PORT}`) /* if there are no errors, the message will be logged in the console. */
})