const express = require('express') // imports express module
const app = express() // creates express app using top-level function exported by the express module
const MongoClient = require('mongodb').MongoClient // imports mongodb module and invokes the class mongoclient method which allows to make connections to the database
const PORT = 2121 // user defined port where the server connects
require('dotenv').config() // imports the dotenv module. config method will read the .env file, parses the data, assigns it to process.env object and returns the object or error key in the object if it failed


let db, //initializes the variable db
    dbConnectionStr = process.env.DB_STRING, // assigns the variable with mongodb connection string from the .env file
    dbName = 'todo' // set the database name
                    // reference link: https://mongodb.github.io/node-mongodb-native/4.0/classes/mongoclient.html#db


// connects to the database using the connect method. connect method structure: connect(url, options, callback)
// connect method also sends back a promise
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) 
    .then(client => {
        console.log(`Connected to ${dbName} Database`)   // console logs when received a promise
        db = client.db(dbName)  // .db method creates a new database instance
    })
    
app.set('view engine', 'ejs') // sets the template engine to use ejs template so it renders a static webpages using the template
app.use(express.static('public')) // builtin middleware that automatically serves static files like css, js and images
app.use(express.urlencoded({ extended: true })) // middleware that automatically parses the incoming url
app.use(express.json()) // middleware that parses the incoming json data and returns an object.


app.get('/',async (request, response)=>{  // makes a get or Read request to the server to the '/' route using a async function 
    const todoItems = await db.collection('todos').find().toArray()     // goes to database gets the collection todos, finds all document in the collection which returns a cursor or a pointer to the documents, which then converted to array of objects using toArray method. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // returns a count of documents that satify the query condition
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // returns a template rendered into html using the values passed as props
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {  // makes a post or Create request to the server using the /addTodo route
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // adds one document using the insertOne method and data is sent in json. returns a boolean true or false depending on the success of operation 
    .then(result => { // runs if returned promise is true
        console.log('Todo Added') // logs the document is added
        response.redirect('/') // redirects the page to / which refreshed the page and  makes a get request which rerenders the ejs template using new value from the database 
    })
    .catch(error => console.error(error)) // runs if the returned promise is false and console logs the error
})

app.put('/markComplete', (request, response) => { // makes a put or Update request to the /markComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ // goes to the collection todos find one document that matches the query parameter and updates it with new value.takes three parameters. filter, update, options
        $set: { // set is a operator that changes the value of the field in the document => update parameter
            completed: true //changes the value of the completed key to true
          }
    },{ //options parameter
        sort: {_id: -1}, // sorts the document in descending order
        upsert: false // tells not to create the document if no document was not found with the matching criteria
    })
    .then(result => { // runs if the update method returns a true boolean value as the promise
        console.log('Marked Complete') // logs that document is marked complete
        response.json('Marked Complete') // sends a json value of marked complete to server
    })
    .catch(error => console.error(error)) // runs if the returned promise is false and console logs the error

})

app.put('/markUnComplete', (request, response) => { //makes a put or Update request to the /markUnComplete route
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{// goes to the collection todos find one document that matches the query parameter and updates it with new value.takes three parameters. filter, update, options
        $set: { // set is a operator that changes the value of the field in the document => update parameter
            completed: false //changes the value of the completed key to false
          }
    },{ // options parameter
        sort: {_id: -1}, // sorts the document in descending order
        upsert: false // tells not to create the document if no document was not found with the matching criteria
    })
    .then(result => { // runs if the update method returns a true boolean value as the promise
        console.log('Marked Complete') // logs that document is marked not complete
        response.json('Marked Complete') // sends a json value of marked not complete to server
    })
    .catch(error => console.error(error)) // runs if the returned promise is false and console logs the error

})

app.delete('/deleteItem', (request, response) => { // makes a Delete request to the /deleteItem route
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) // finds one document that matches the query and deletes it. takes the filter and options parameter. returns true if successful or false if not
    .then(result => { // runs if returned promise is true
        console.log('Todo Deleted') // logs the value is deleted
        response.json('Todo Deleted') // sends a response of deletion to server
    })
    .catch(error => console.error(error)) // runs if the returned promise is false and console logs the error

})

app.listen(process.env.PORT || PORT, ()=>{ // tells the server to run on the port set by the running environment or use the user defined port
    console.log(`Server running on port ${PORT}`) // logs the port server is running
})