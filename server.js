const express = require('express') //These are like C #include commands. This bundles in the express package
const app = express() //And this defines an express object for us to use as the server foundation
const MongoClient = require('mongodb').MongoClient //This is the MongoDB package for database work
const PORT = 2121 //A default port in case we don't have one defined in the environment (on a cloud server our provider will typically assign one, but we need this for localhost testing)
require('dotenv').config() //dotenv package lets us define and use our own .env files. Very important to AVOID EXPOSING KEYS


let db, //Somewhat analogous to a C fstream object, we'll assign this our actual db connection
    dbConnectionStr = process.env.DB_STRING, //Our passkey to the database
    dbName = 'todo' //The actual name of the database we want (TODO: ACTUAL DEFINE THIS)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //Open the database connection
    .then(client => { //And once that promise returns,
        console.log(`Connected to ${dbName} Database`) //Announce our success
        db = client.db(dbName) //And assign the connection (with the name of the specific database we want) to our db object
    })
    
app.set('view engine', 'ejs') //Use EJS as our render engine
app.use(express.static('public')) //Use a public folder for static content so EJS doesn't have to render absolutely everything, just dynamic content
app.use(express.urlencoded({ extended: true })) //Lets us handle web headers, using this instead of bodyParser because we have express
app.use(express.json()) //Lets us handle JSON objects in web requests, also something that bodyParser could be used for if not using express


app.get('/',async (request, response)=>{ //When we get a GET (that is, Read) request at the root index
    const todoItems = await db.collection('todos').find().toArray() //Head out to the database and find all the 'todos' entries, and put them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Also count the number of 'todos' entries that have the 'false' value for the 'completed' property
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //Pass this info to EJS for rendering, then pass the result to the initial requester
    // db.collection('todos').find().toArray() //lines 28 thru 24 to do the same, but is non-blocking because it uses promises. The above code is blocking. 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false}) //I'm only supposed to comment, not alter the original code itself, so this stuff stays commented out.
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error)) //Not sure why this catch is commented out, but I suspect it might be useless with the promise-less format above.
})

app.post('/addTodo', (request, response) => { //When we get a POST (that is, Create) request to /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //Add a single item to the database in the 'todos' collection
    .then(result => { //When we succeed at that
        console.log('Todo Added') //Log our success
        response.redirect('/') //And redirect the user to the root page so they get an updated view (and don't have to watch the loading bar forever as the browser waits for a response.)
    })
    .catch(error => console.error(error)) //If something goes wrong, log the error. What the user sees is not defined here, that'll be either framework or browser dependent with this structure
})

app.put('/markComplete', (request, response) => { //When we get a PUT (that is, Update) request to /markComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Find the specific item noted
        $set: {
            completed: true //And change its completed property to 'true'.
          }
    },{
        sort: {_id: -1}, //I think this means 'sort numerically' but I'm not sure off hand.
        upsert: false //If entry does not exist, DON'T create it. Just do nothing.
    })
    .then(result => { //Once that's done
        console.log('Marked Complete') //Log our success
        response.json('Marked Complete') //And also send a success message to the user browser
    }) //As far as I can tell, the "Entry does not exist case" also counts as success and will claim item marked as completed. Unless the database throws an error when told not to upsert? Which I doubt.
    .catch(error => console.error(error)) //If something goes wrong, log the error. User doesn't get this message because it might expose vulnerabilities.

})

app.put('/markUnComplete', (request, response) => { //When we get a PUT request to /markUnComplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //Find the specific item noted
        $set: {
            completed: false //And change its completed property to 'false'.
          }
    },{
        sort: {_id: -1}, //Sorting rules
        upsert: false //And if item does NOT exist, don't create it. It seems we're enforcing creating via /addTodo.
    })
    .then(result => { //On completion
        console.log('Marked Complete') //Log our success
        response.json('Marked Complete') //And let the user know of success
    })
    .catch(error => console.error(error)) //And if things break, log the error

})

app.delete('/deleteItem', (request, response) => { //When we get a DELETE request (Which, unlike all the others, is exactly the same in the CRUD acronym as in GPPD) at /deleteItem
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //Find the offending item and vaporise it. Completion status does not matter.
    .then(result => { //Upon success
        console.log('Todo Deleted') //Log our success
        response.json('Todo Deleted') //And let the user know of our success
    }) //It doesn't check completion status. If we have multiple of the same task but one is done and others aren't, it might erase one of the unfinished ones. Which seems silly, but users are silly.
    .catch(error => console.error(error)) //If something breaks, log the error

})

app.listen(process.env.PORT || PORT, ()=>{ //Fire up the server. If we have a environment variable PORT (as cloud servers often provide), use that, otherwise use our const PORT we defined on line 4
    console.log(`Server running on port ${PORT}`) //Once the server is live, log that we're up and running
})