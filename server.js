const express = require('express') /**having installed express, essentially makes it possible to use */
// "require() can be called rom anywhere inside the program but import() cannot be called conditionally and must run at the beginning of the file."
// "require will automatically scan node_modules to find modules, but import , which comes from ES6, won't. Most people use babel to compile import and export , which makes import act the same as require" interesting (via Stack overflow)
const app = express() //assign to the "app" variable as is conventional
const MongoClient = require('mongodb').MongoClient //need mongo to use
const PORT = 2121 //your arbitrary port that should not be running anything else
require('dotenv').config() //need this to look at local env which houses the db connection string


let db, //declare variable for easier conventional usage of mongo db methods
    dbConnectionStr = process.env.DB_STRING, //a superfresh connection string was added to a new .env so that the app works. Note that dbName must match the following.
    dbName = 'todo' //what we will call the db. name of database attached to new cluster

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connect to database. Promise based
    .then(client => { //callback to run on successful connection to db
        console.log(`Connected to ${dbName} Database`) //print to terminal for visible success
        db = client.db(dbName) //assign the db to the db var
    })
    
app.set('view engine', 'ejs') //establish views so that ejs can be used and index.ejs recognized
app.use(express.static('public')) //tell express to load the files in the public directory - your CSS and client-side js. built-in method of express to serve a static file

// parse body of reqs
app.use(express.urlencoded({ extended: true })) //so that the app can handle urlencoded form data and recognize incoming data. built-in method of express
app.use(express.json()) //so that data in json format can be handled

// look for documents in database, and display conditionally with styles based on value against "completed" key
app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray() //set up an array of all the items found in the db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //assign to a variable the number of items in db that 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //serve the compiled index.ejs file and pass the data to the variables we are calling "items" and "left" inside the ejs file.
    db.collection('todos').find().toArray() //get all documents (no filter applied in .find() db method). This is also async but written in more traditional promise style?
    .then(data => {
        db.collection('todos').countDocuments({completed: false}) //then count how many docs. note that this is mongo filter and array method, unlike how you might normally use array.filter(LOGIC).length
                                                                // this informs the "number of items todo" variable in the ejs that will be rendered, to show an integer based on the count
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft }) //this reads a bit duplicative. Why not pass all your variables more concisely to be rendered in the ejs?
        })
    })
    .catch(error => console.error(error)) //if the operation fails for some reason, the error prints to console. See below...
})

// node is pretty unhappy with the submit req even though it goes through. "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
app.post('/addTodo', (request, response) => { //when a post req is sent to the path /addTodo
    // upon receipt of req, this inserts the new item name input from the user, sent in a req body, with a default value of false for the 'completed' key value.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added') /**notifies anyone watching the browser console that this operation ran */
        response.redirect('/') /**refreshes the page back to root - sending a new get (read) req so that the newly added item is rendered in the list */
    })
    .catch(error => console.error(error))  //if the operation fails for some reason, the error prints to console. Error is "caught" if any of the above ops fails or throws an exception - "control" is given to the .catch
})

app.put('/markComplete', (request, response) => { //when a put req is sent to the path /addTodo
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //the todos collection in the db - method of updateOne is called and the req body value for "itemFromJS" is passed to it
        $set: { //this Mongo operator replaces the value of the following named key "completed", if found, with the boolean "true"
            completed: true 
          }
    },{
        sort: {_id: -1}, //sort in reverse order of id number
        upsert: false //if you can't find the item, don't create a new doc. Still Mongo.
    })
    .then(result => {
        console.log('Marked Complete') //all the above done, callback here will print success notice to the console.
        response.json('Marked Complete') //because the http req is still listening for a response
    })
    .catch(error => console.error(error)) //errors will be logged to the console

})

app.put('/markUnComplete', (request, response) => { //marked IN complete... the path however should match the put req sent.
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //just like the above but replaces the value of the key "completed" with false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete') //this and following line should state "Marked Incomplete" instead
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //when a .delete req is sent to the path "/deleteItem"
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //mongo method .deleteOne - req body itemFromJS value is passed as value for the doc key "thing" to this method
    .then(result => {
        console.log('Todo Deleted') //Mongo will execute the async deleteOne opp. When done, this prints success message to console.
        response.json('Todo Deleted') //bc req is listening for a response
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{ //configure the port || logic tells express where to look for the env variables. If the (hosted) env var can be found, use that. If not, use locally defined port. 
    console.log(`Server running on port ${PORT}`) //print a human readable success message to terminal
})