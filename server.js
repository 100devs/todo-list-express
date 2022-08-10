
//This block sets up our dependencies, we keep it up here so that if you need to edit the file, you don't need to search the entire file for the uses of these variables.
const express = require('express') // enable use of Express JS framework
const app = express() // creates an instance of express; keeps code DRY by not having 
const MongoClient = require('mongodb').MongoClient // enables use of MongoDB client module, which connects database to our server
const PORT = 2121 // this tells Express what port to listen on, not just on local, if you set it up remotely it would still be listening to this port. 
require('dotenv').config() // 'We're first importing env (environement variable file) and then loading using .config() (must install env module via npm install dotenv 
//you always want your .env file in the base directory.... 


let db,  //initialize variables for db globally, as far as this file goes, but with no value, so that variable can be used anywhere in this file
// dbConnectionStr (MongoDB connection string from .env)
    dbConnectionStr = process.env.DB_STRING,
    //dbName (MongoDB collection 'todo')
    dbName = 'todo'

// Initialize the connection to MongoDB
// note: without .then() this would return a promise, if it's resolved your connection is successfull, if its rejected then there was a problem somewhere along the line

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
//.then() is the old way to do this, the async await code below is contemporary
//.then() tells the server what to do if the promise is resolved- in this case we're console logging 'Connected to -databaseName-'
.then(client => {
        console.log(`Connected to ${dbName} Database`)
//'db = client.db(dbName)' variable client is returned with the promise
        db = client.db(dbName)
    })
//was no catch() method here so we added it to catch errors and display a message
    .catch(error => console.log(error))


app.set('view engine', 'ejs')       // tell express that ejs is the view engine (template engine)
app.use(express.static('public'))       //tells server, whatever is in public file, to just serve it as-is (other files like ejs, on the other hand, will be dynamically)
app.use(express.urlencoded({ extended: true }))     //the urlencoded is middleware (intercepts reqeusts and responses betwen clinet/server); here it allows query data to be passed to server via URL request (http://localhost/route?variable=value&otherVariable=otherValue)
app.use(express.json())     // enables express to understand json

// Defines a 'get' method at the root of the server
app.get('/',async (request, response)=>{ 
    // request to mongo to return all records from 'todo' collection, in an array
    const todoItems = await db.collection('todos').find().toArray()
    //this is like the find() function but instead of telling it to return the contents, youre telling to to return the matches; basically, look through the todo collection and using the countDocuments method, tell it how many have propertry completed:false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //we've got what we want from the server via get request, now we tell it what to do, which is 'take the list of toDoItems, assign it to variable items, lake all itemsLeft and assign to variable left, and now, take that data and feed it into the ejs template engine, and whenever that ejs document is finished rendering, that is what we send back to the endusers client
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
//if you wanted to understand this further, go to the Express documentation, go into res.render. If that doesn't make sense, google tailor a search to development blogs
//you'll notice a shitload of these are hosted on medium.com.... if that's an issue try DEvTWo (dev2?)
//judge your search results based on google post date
//or, learn how to pass in post dates to your google search
    

    // This code is the non-async simpler version, using promise chains!
    ////We go into the database into collection 'todos'. Find() all documents, in this case there's 3, put it in an array so we can more esaily access it.  
    // db.collection('todos').find().toArray()
    ////We pass the array into the .then method as parameter 'data'
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         //this is passing the array of obejcts into the EJS template via the render() method, passing the array 'data' into the EJS template as the value of the property named 'items:' 
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//First line is a post request that will fire when the user posts to their page
//or 'post method for receiving a new to-do item'
app.post('/addTodo', (request, response) => {
    //db.collection - server takes the string of text and bundles it into an object that adds the completed:false property
    //or 'adds new todo item to the db, with completed field set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //These console.logs, or if coding in production, other console alerts, are peperred throughout so that you can check the heroku logs for what is working and what is not.
        // So these console.logs are for the heroku console
        console.log('Todo Added')
        response.redirect('/')
    })
    //if there's an error, log it on Heroku
    .catch(error => console.error(error))
})


//defines an endpoint to handle a put request
app.put('/markComplete', (request, response) => {
    //updates a record, using value received from 'ItemFromJS' in the body of the request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //update the newest document if multiple results, if nothing matches, don't create a new record
        sort: {_id: -1}, 
                         //// for ex, if you had 'walk the dog' on this todo list already, -1 will sort to the newest version of 'walk the dog', while 1 would sort to oldest
                         //basically, 'sort the database by the ID's of the elements in descending order'
                         
        upsert: false  //(tells Mongo, if nothing matches, don't create anything)
    })
    //if success , log to Heroku and send the response
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

////Does the opposite of the previous request, so we user can mark things 'Uncomplete'
app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //if successfull, log to heroku and send response
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})


//handles a delete request at the defined endpoint
app.delete('/deleteItem', (request, response) => {
    //mongoDB function to delete a single todo item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    //if successfull, log to heroku and send response
    //all console.log's running in porduction (on Heroku) will show up in Heroku logs
    //in a development/local workflow, the logs would show up in your.... browser?
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

//starts the server and waits for requests- this MUST be at the end
//whenever Node hits this function, it will loop over and over again until you kill the server (Ctrl+c)
//app.listen is a blockiong function; so with the 
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
