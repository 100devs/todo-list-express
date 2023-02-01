// Here we'll define variables to use as shortcuts to different packages we're requiring in the app.
const express = require('express') // Express helps a ton with setting up the server!
const app = express() // here we just define app to easily call express() as needed
const MongoClient = require('mongodb').MongoClient // requiring mongodb, will enable us to set up the connection a bit later
const PORT = 2121 // we set the PORT variable (capslock because it's hard-coded) so that if we need to change the port we're listening on, we only have to change it here.
require('dotenv').config() // allows us to use environment variables

// Next few lines set up the database connection
let db, // declare db but not yet assigned value. I assume we want it be global in scope, but the value will come from within the function below!
    dbConnectionStr = process.env.DB_STRING, // grabbing the (secret!) DB_STRING from the .env file and storing it here
    dbName = 'todo' // since we're doing a to-do list, we call the database something that corresponds with that - like 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
/* function, or rather a method from the mongodb required above. Plugs in dbConnectionStr, the unique string to connect to our specific cluster
    then the response we get is an object, from which we grab a db method & plug in dbName - we set the return value to our global db variable
*/

// Here we config some middleware for Express to use.
app.set('view engine', 'ejs') // Express sets the 'view engine' to 'ejs'
app.use(express.static('public')) // Beautiful line of code. "It just... works" - Leon. Enables Express to automagically access/serve up all our static files in the 'public' folder.
app.use(express.urlencoded({ extended: true })) // Express updated version of bodyparser, i think?
app.use(express.json()) // Express & JSON, a match made in heaven


// Now we start coding out responses!

app.get('/',async (request, response)=>{ // Express is listening for a GET request on the root route
    const todoItems = await db.collection('todos').find().toArray() // todoItems will (eventually) hold an array of ALL documents from the todos collection in our connected db
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // itemsLeft will be a count of documents from the todos collection which are completed: false (aka incomplete)
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // the response will be to render the index.ejs file with variable 'items' being the todoItems array, and 'left' being the number we just counted
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
    // the above is a variation on the same code, but using promise chains as opposed to the async/await syntax.
})

app.post('/addTodo', (request, response) => { // Express listens for POST requests on the /addTodo route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // we tell MongoDB to create a new document in the todos collection with info from the request body
    .then(result => { // promise result, not accessed so could have been written as .then(() => {...})
        console.log('Todo Added') // console.logs the action that was taken on success - this console is the command line where the server is running, not the browser!
        response.redirect('/') // "hey you should probably refresh" - server to browser. This of course triggers the prior route - GET on root - above this one!
    })
    .catch(error => console.error(error)) // if (something bad happened) (LET ME KNOW WHAT IT WAS)
})

app.put('/markComplete', (request, response) => { // PUT request on the /markComplete route, we'll be updating something here
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // todos collection in the database - update the entry where the 'thing' property is request.body.itemFromJS
        $set: { // $set tells it to update a property
            completed: true // we're marking something complete, so we change it from false to true.
          }
    },{
        sort: {_id: -1}, // start from the beginning
        upsert: false  // don't create a new document if you don't find one you can update to start with
    })
    .then(result => { // once the previous block resolves...
        console.log('Marked Complete') // show success in the console, or CLI
        response.json('Marked Complete') // respond with JSON "marked complete"
    })
    .catch(error => console.error(error)) // if something goes wrong, tell us!

})

app.put('/markUnComplete', (request, response) => { // another PUT request, but on the /markUnComplete route. This route will be basically the same but opposite of the prior one
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

app.delete('/deleteItem', (request, response) => { // DELETE request, spicy. On the /deleteItem route. We will be removing something.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // tells the connected db to find one document with matching name from the input and YEET it.
    .then(result => { // then...
        console.log('Todo Deleted') // success message
        response.json('Todo Deleted') // success message
    })
    .catch(error => console.error(error)) // !success message

})

app.listen(process.env.PORT || PORT, ()=>{ // this is what tells the server where to set up shop. We grab the PORT from the .env file, or if it's not available, the hardcoded PORT variable from the top of the page
    console.log(`Server running on port ${PORT}`) // CLI log that the server is live & running on ${PORT}
})