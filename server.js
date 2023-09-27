/*
mporting Required Modules:

    const express = require('express'): This line imports the Express.js framework, which is used to create web applications in Node.js.

    const app = express(): It creates an instance of the Express application.

    const MongoClient = require('mongodb').MongoClient: This line imports the MongoDB client, which is used to connect to and interact with MongoDB databases.

    const PORT = 2121: This sets the port number for the Express application to listen on.

    require('dotenv').config(): This line loads environment variables from a .env file, if available. Environment variables are often used to store sensitive or configuration-related information.

*/
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    /*
            Variable Declarations:

        let db: This variable will be used to store a reference to the MongoDB database once the connection is established.

        dbConnectionStr = process.env.DB_STRING: This line retrieves the MongoDB connection string from the environment variables. The connection string typically contains information like the database server's address, port, and authentication credentials. This string is usually stored in the .env file.

        dbName = 'todo': This variable stores the name of the MongoDB database you want to connect to, which in this case is 'todo'.

    Connecting to the Database:

        MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }): This line initiates a connection to the MongoDB server using the MongoClient from the MongoDB Node.js driver. It takes two arguments:
            dbConnectionStr: The MongoDB connection string, which specifies how and where to connect to the database.
            { useUnifiedTopology: true }: This option is used to enable a more modern and unified topology engine for MongoDB.

        .then(client => { ... }): This is a promise-based approach for handling the result of the connection attempt. When the connection is successfully established, the code inside the callback function is executed. In this case:

            console.log(Connected to ${dbName} Database): This line simply logs a message indicating that the connection to the specified database was successful.

            db = client.db(dbName): This line sets the db variable to the MongoDB database object, which allows you to interact with the 'todo' database in subsequent parts of your code.

After this code snippet executes successfully, you'll have an active connection to the 'todo' database, and you can perform operations like inserting, updating, and querying data from that database using the db variable.
    */

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
/*
This portion of code is configuring some settings and middleware for your Express.js application. Let's break down each line:

    app.set('view engine', 'ejs'):
        This line sets the view engine for your Express application to EJS (Embedded JavaScript). EJS is a template engine that allows you to embed JavaScript code within your HTML templates. It's commonly used for rendering dynamic web pages.

    app.use(express.static('public')):
        This line sets up a static file server using Express's built-in express.static middleware. It serves static files (such as HTML, CSS, JavaScript, images, etc.) from a directory named 'public'. In other words, any files placed in the 'public' directory will be accessible directly through your web application.

    app.use(express.urlencoded({ extended: true })):
        This middleware is used to parse incoming HTTP request bodies with a Content-Type of 'application/x-www-form-urlencoded'. This is commonly used when you submit HTML forms with data.

    app.use(express.json()):
        This middleware is used to parse incoming JSON data in the request body. It parses JSON data and makes it available in your route handlers as req.body.

Here's what each of these settings/middleware does:

    Setting the view engine to EJS allows you to render EJS templates in your application, making it easier to generate dynamic HTML content.

    Serving static files from the 'public' directory enables you to serve CSS, JavaScript, images, and other assets directly to clients.

    Parsing 'application/x-www-form-urlencoded' data with express.urlencoded is essential when you want to process form submissions sent from HTML forms.

    Parsing JSON data with express.json() is useful when you expect JSON data in the request body, such as when working with RESTful APIs.

*/


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
     .then(data => {
         db.collection('todos').countDocuments({completed: false})
         .then(itemsLeft => {
             response.render('index.ejs', { items: data, left: itemsLeft })
         })
     })
     .catch(error => console.error(error))
})

/*
this code defines a route handler for the root URL ('/') in your Express.js application. Let's break down what this code does step by step:

app.get('/', async (request, response) => {

This line sets up a GET request handler for the root URL ('/') using the app.get() method. When a user accesses the root URL of your application in a web browser, this handler will be invoked.


const todoItems = await db.collection('todos').find().toArray()

This line uses await to fetch all documents from a MongoDB collection named 'todos' and store them in the todoItems variable. The .find().toArray() method fetches all documents as an array.


const itemsLeft = await db.collection('todos').countDocuments({ completed: false })

This line counts the number of documents in the 'todos' collection where the 'completed' field is set to false and stores the count in the itemsLeft variable.


response.render('index.ejs', { items: todoItems, left: itemsLeft })

This line renders an EJS template named 'index.ejs' and passes two variables to the template: items (containing the fetched to-do items) and left (containing the count of incomplete to-do items). These variables can be used within the 'index.ejs' template to dynamically generate HTML content based on the data.

*/


/*
This part of the code is essentially doing the same thing as the earlier part but without the use of async/await. It uses promise chains (then and catch) to achieve the same result: fetching data from the 'todos' collection, counting the incomplete items, and rendering the 'index.ejs' template with the retrieved data.
Overall, this route handler is responsible for fetching data from a MongoDB collection ('todos'), counting the number of incomplete to-do items, and rendering an EJS template ('index.ejs') with this data. The rendered template likely displays a list of to-do items and the number of incomplete items on the web page when a user accesses the root URL of your application.
*/


//This line sets up a POST request handler for the '/addTodo' endpoint using the app.post() method. This means that this handler will be invoked when a client (usually a form submission) sends a POST request to '/addTodo'.
//The line uses the insertOne() method of the MongoDB collection 'todos' to insert a new document into the collection. The document being inserted has two fields: 'thing' and 'completed'. 'thing' is set to the value of request.body.todoItem, which is presumably taken from a form submission. 'completed' is initially set to false.
//This block of code is a promise chain. After the insertion is successful, the .then() block is executed. It logs 'Todo Added' to the console and then redirects the client back to the root URL ('/') using response.redirect('/'). This typically refreshes the page and displays the updated list of to-do items, including the newly added item.
//If there is any error during the insertion process, the .catch() block will be executed. It logs the error to the console, helping with debugging.
app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})


/*
This code line 153 -168 defines a route handler for handling HTTP PUT requests to the '/markComplete' endpoint in your Express.js application. Let's break down what this code does step by step:

This line sets up a PUT request handler for the '/markComplete' endpoint using the app.put() method. This means that this handler will be invoked when a client sends a PUT request to '/markComplete'.

This block of code is using the updateOne() method of the MongoDB collection 'todos' to update a document in the collection
*/
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
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
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
/*
This code on line 170 - 185 defines another route handler, similar to the previous one, but for marking a to-do item as uncompleted. Let's break down this code step by step:
 line sets up a PUT request handler for the '/markUnComplete' endpoint using the app.put() method. This handler will be invoked when a client sends a PUT request to '/markUnComplete'.
This block of code is quite similar to the previous one. It uses the updateOne() method of the MongoDB collection 'todos' to update a document in the collection. The update operation is defined as follows
*/




app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})
//This code 195 - 203 defines a route handler for handling HTTP DELETE requests to the '/deleteItem' endpoint in your Express.js application. Let's break down what this code does step by step
//line sets up a DELETE request handler for the '/deleteItem' endpoint using the app.delete() method. This means that this handler will be invoked when a client sends a DELETE request to '/deleteItem'.
//This block of code uses the deleteOne() method of the MongoDB collection 'todos' to delete a single document from the collection. The document to delete is identified by the query criteria: { thing: request.body.itemFromJS }. It appears that the value to identify the document to delete is taken from the request.body.itemFromJS property.
//This block of code is a promise chain. After the deletion operation is successful, the .then() block is executed. It logs 'Todo Deleted' to the console and sends a JSON response of 'Todo Deleted' back to the client.



app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

/*
This line logs a message to the console indicating that the server is running and listening on a specific port. The ${PORT} part is replaced with the actual port number being used by the server.

In summary, this code starts your Express.js server and makes it listen on a specified port, which can be provided through an environment variable (process.env.PORT) or a default value (PORT). It also logs a message to the console to indicate that the server is up and running.

*/