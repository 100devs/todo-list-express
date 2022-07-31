 // Import express module - Allows the use of Express
const express = require('express')
// Assign app function to express simplyfing it
const app = express()
//Importing mongodb module
const MongoClient = require('mongodb').MongoClient
// Set the port of our application to 2121
const PORT = 2121
// Set our environment variable file and requiring it. This helps keeping the password of the database private because that file is included in gitignore.
require('dotenv').config()

// Declare our database url and names
let db,
    // Declaring our database password with an environment variable
    //This .env file will not be uploaded to github because it is in the .gitignore file
    dbConnectionStr = process.env.DB_STRING,
    // Declaring our database name 
    dbName = 'todo'

    
// Connect to our database using our environment variable and the Mongo API (Last part, source: Carlabreis)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    
        .then(client => { 
            //Console to let user know connection to database was successful
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName) 
    })

// Middlewares and other routes here... 
// Set our view/rendering engine to ejs
app.set('view engine', 'ejs')
// Set our express server to use public folder "public" for client-side files
app.use(express.static('public'))
// Set our express server default to use the url encoded format. Only looks at requests where the Content-Type header matches the type option (Source: Brandon003)
app.use(express.urlencoded({ extended: true }))
// Set our express server to use our json parser
app.use(express.json())


// Read (GET)- Get something and await for a response. It responds to the client's fetch request. 
app.get('/',async (request, response)=>{
    // Get all the todos items from the database
    const todoItems = await db.collection('todos').find().toArray() //Puts them in an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //Counts the number of items, which will be then displayed by the HTML rendered by the ejs file.  
    
    // Render the index.ejs file with items and items left. It responds the request with an HTML.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //This is the long way to do it: Instead of async/await it uses a .then...
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


//Create (Post) - Ask server to add a Todo item to Mongodb in the body with completed status set as false
app.post('/addTodo', (request, response) => { //The URL is /addTodo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // console log when item has been added
        console.log('Todo Added')
       //refresh page (go to root again) to see new todo item - This is a new read request, not an update.
        response.redirect('/')
    })
    // catch error if something goes wrong
    .catch(error => console.error(error))
})

//Update (Put) - This section is where a task would be marked as complete, once completed by the user and updated in MongoDB
app.put('/markComplete', (request, response) => {
    //updating items status completed or not  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //setting the completed status to true
        $set: {
            completed: true
          }
    },{
        //setting status to false 
        sort: {_id: -1}, //Sort by _id, making the element appear at the bottom.
        upsert: false  //Update and insert false. Don't want to have the same document twice in the db. False is the default value.
    })
    .then(result => {
        // console log if item has be completed
        console.log('Marked Complete')
        // adding response to ejs 
        response.json('Marked Complete')
    })
    //catch error
    .catch(error => console.error(error))

})

//Update (Put) - Updates Mongodb to change status of Item to Uncomplete
app.put('/markIncomplete', (request, response) => {
    //updating items status completed or not  
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            //setting the completed status to false
            completed: false
          }
    },{ 
        //setting status to false 
        sort: {_id: -1}, //Sort by _id, making the element appear at the bottom. I think this was badly copypasted and should be 1 to put it at the top. 
        upsert: false  //Update and insert false. Don't want to have the same document twice in the db. False is the default value
    })
    .then(result => {
        // console log if item has been completed
        console.log('Marked Incomplete')
        response.json('Marked Incomplete')
    })
    .catch(error => console.error(error))

})

//Deleté (Delete) - It selects an element, the one that matches itemFromJS and tells the db to drop it from the collection. 
app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) 
    .then(result => {
        
        console.log('Todo Deleted')  //If everything went ok, it logs the message in the console
        //upating the page (READ REQUEST) letting user know item was deleted
        response.json('Todo Deleted')  
    })
    //catch error
    .catch(error => console.error(error))

})

//This is where you can add a specific local host or be assigned one when uploaded to the hosting app(Heroku)
app.listen(process.env.PORT || PORT, ()=>{
    //loggin server errors
    console.log(`Server running on port ${PORT}`)
})
