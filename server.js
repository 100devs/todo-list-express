const express = require('express') // set up express in our app
const app = express() // also setting up express in our app
const MongoClient = require('mongodb').MongoClient // setting up mongodb to work in our app
const PORT = 2121 // setting the port we will run our app on 
require('dotenv').config() // imports the dotenv npm packages and calls them with the .config method


let db, // declares the db variable
    dbConnectionStr = process.env.DB_STRING, // adds the db string value to the dbConnectionStr variable
    dbName = 'todo' // adds the 'todo' string to the dbName variable to use to connect our db later

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // establishes connection to mongo db
    .then(client => { // tells the app to do this next phase after finishing establishing a connection
        console.log(`Connected to ${dbName} Database`) // lets us know when our db is connected succesfully in the console
        db = client.db(dbName) //  uses the declared db variable earlier to initialize a connection to a specific mongodb database
    })
    
app.set('view engine', 'ejs') // letting express know you're using ejs as your templating language
app.use(express.static('public')) // setting up the public folder so any files in it just work with our backend (css, main.js)
app.use(express.urlencoded({ extended: true })) // replace body parser (this and next line)
app.use(express.json()) // peak into the request object and get everything we need out of it


app.get('/',async (request, response)=>{ // tells the app to get the app page attached to the '/'
    const todoItems = await db.collection('todos').find().toArray() // finds the info from the db and turns it into an array of info
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts the number of items left in the db with the {completed: false} match
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the info into an ejs file to show the items on the todo list and then the items left to do
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { // a post request that initializes an addition to the todo list added by the user
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // goes into the db and inserts a todo item into the db and adds shows that it hasn't been completed yet
    .then(result => { // after the above is done we do the below next
        console.log('Todo Added') // tells us in the console that the item was added succesfully to the todo list
        response.redirect('/') // reloads the page to show the updated list
    })
    .catch(error => console.error(error)) // logs an error if adding the item to the db fails
})

app.put('/markComplete', (request, response) => { // starts a put request to update the app and db if the user marks an item as completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // finds the item in the db that is going to be updated in the code below
        $set: { // used to replace a value in the db with a specified value 
            completed: true // replaces the value "false" with "true"
          }
    },{
        sort: {_id: -1}, // tells the request to grab the first item in database with the correct value
        upsert: false // makes sure if the sort function above has nothing to filter, nothing is done
    })
    .then(result => { // do the below code after the code above is finished
        console.log('Marked Complete') //logs that the object in the db has been updated
        response.json('Marked Complete') // json responds telling the user the put request is completed and the todo item was marked completed
    })
    .catch(error => console.error(error)) // throws an error if the item failed to be marked completed

})

app.put('/markUnComplete', (request, response) => { // starts a put request to update the app and db if the user marks an item as incompleted
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes into the db to find the item to be marked as incompleete
        $set: { // used to replace a value of an item in the db
            completed: false // replaces the true value for a false on the requested todo list item
          }
    },{
        sort: {_id: -1}, // sorts the list in descending order 
        upsert: false // makes sure nothing happens if the sort function isn't able to sort anything
    })
    .then(result => { // tells the server to do the next code after finishing the above code
        console.log('Marked Complete') // logs complete in the console one the put is finished succesfully
        response.json('Marked Complete') // repsonds to the user that the update of the todo list item has been marked as incomplete
    })
    .catch(error => console.error(error)) // throws an error if the todo item fails to be marked as incomplete

})

app.delete('/deleteItem', (request, response) => { // starts a delete request to delete a todo list item from the app and db
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // goes into the db and finds the item to be deleted and deletes it
    .then(result => { // does the next code after deleting the item succesfully
        console.log('Todo Deleted') // logs the message 'todo deleted'
        response.json('Todo Deleted') // adds a response to let the user know the todo item has been deleted successfully
    })
    .catch(error => console.error(error)) // throws an error if a problem occurs trying to delete the item and fails

})

app.listen(process.env.PORT || PORT, ()=>{ // starts a request for the app to start running on a port
    console.log(`Server running on port ${PORT}`) // telling our app to listen on process.env port or our own port we say (2121 in this case)
})
