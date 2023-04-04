//assign all required modules to variables
const express = require('express')//making it possible to use express in this file
const app = express()//saving this invocation of express as a constant called app
const PORT = 2121//creating a constant that holds the location that listens for the server
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const todoRoutes = require('./routes/todo')
//dotenv file created to hold connection string
require('dotenv').config({path: './config/.env'})//alows us access to the contentof the dotenv file
connectDB()
//set variables for database, connection string,and DB name
// let db,//declaring a variable here makes it a global variable
//     dbConnectionStr = process.env.DB_STRING,//declaring a variable and assigning it to the connection string
//     dbName = 'todo'//settting the name of the db

//connect to db using connection string while passing in an additional property

//set up middleware
//this MW is used to set up the ejs template as default render 
app.set('view engine', 'ejs')
//this MW is used to apply the public files that are used to hold static files
app.use(express.static('public'))
//tells express to decode and encode urls where the header matches the content. supports arrays and object
app.use(express.urlencoded({ extended: true }))
//used to parse incoming request json payloads
app.use('/', homeRoutes) 
app.use('/todos', todoRoutes)

//sets up a GET method for the root route  with req and res as parameters
// app.get('/',async (request, response)=>{
//      const todoItems = await db.collection('todos').find().toArray()//creating a constant and awaits all items from the todos collection and turn them into an array
//      const itemsLeft = await db.collection('todos').countDocuments({completed: false})//sets a variable and awaits a count of items in the collection that are not completed to display in EJS

//      //rendering our index ejs and displaying the items in the db and the count of uncompleted items
//      response.render('index.ejs', { items: todoItems, left: itemsLeft })

//     // This is a GET request sent to the server to go to the DB into the collection called todos
//     // to find documents and turn those documents into arrays
//     // db.collection('todos').find().toArray()
//     // //a promise is returned 
//     // .then(data => {
//     //     //inside the promise we use the countDOcuments method which is used to count the number of documents that meet a particular criteria in this case {completed: false}
//     //     db.collection('todos').countDocuments({completed: false})
//     //     .then(itemsLeft => {
//     //         //A response to render ejs is sent back which in turn returns HTML to the html page
//     //         response.render('index.ejs', { items: data, left: itemsLeft })
//     //     })
//     // })
//      .catch(error => console.error(error))
// })``
// //This is the create or post method on the addTodo route is used to input todo items into the DB using a form, url or anchor tag
// app.post('/addTodo', (request, response) => {
//     //a request is made to the server to go tothe db and then to the collection to inset a document matching a specific criteria of the key and completed values. For the key the values is from the body of the request with the name todoITem and for the completed the value is a false boolean
//     db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
//     //a promise is returned if the insert is successful 
//     .then(result => {
//         // a message is logged to the console to confirm that the request is successful
//         console.log('Todo Added')
//         //gets rid of addTodo route and redirects to root route
//         response.redirect('/')
//     })
//     //catch promise in case the code is unsuccessful
//     .catch(error => console.error(error))
// })

// //This is a put or update method used to update documents in the database when the markComplete route is passed through
// app.put('/markComplete', (request, response) => {
//     //the request tells the server to go into the database and then into the collection to update one document that meets the criteria which in this case is a key value pair with a key called thing and value called request.body.itemFromJS
//     db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         //the db is told to use the set operator to replace the value of a field to a specified value in this case the K/V pair  completed: true
//         $set: {
//             completed: true
//           }
//     },{

//         //the sort method is used to sort fields in ascending or descending order in this case descending order
//         sort: {_id: -1},
//         //the upsert method is used to update and insert the value of a field when the field we are currently updating does not exist
//         upsert: false
//     })
//     // a promise is returned
//     .then(result => {
//         //a message is logged into the console confirming the success of the put request
//         console.log('Marked Complete')
//         // a JSON response is sent back
//         response.json('Marked Complete')
//     })
//     .catch(error => console.error(error))

// })
// //This does the same this as the mark complete except here the field that the set method is replacing is using a K/V pair set to completed: false
// //This is a put or update method used to update documents in the database when the markUncomplete route is passed through
// app.put('/markUnComplete', (request, response) => {
//     //the request tells the server to go into the database and then into the collection to update one document that meets the criteria which in this case is a key value pair with a key called thing and value called request.body.itemFromJS
//     db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         $set: {
//             completed: false
//              //the db is told to use the set operator to replace the value of a field to a specified value in this case the K/V pair  completed: false
//           }
//     },{
//         //the sort method is used to sort fields in ascending or descending order in this case descending order
//         sort: {_id: -1},
//         //the upsert method is used to update and insert the value of a field when the field we are currently updating does not exist
//         upsert: false
//     })
//     .then(result => {
//         //a message is logged into the console confirming the success of the put request
//         console.log('Marked Complete')
//         // a JSON response is sent back
//         response.json('Marked Complete')
//     })
//     .catch(error => console.error(error))

// })
// //this method is used to delete documents in the Db when deleteItem route is passed
// app.delete('/deleteItem', (request, response) => {
//     // a request is sent to the server to go into the database and  to the todos collection and use the deleteOne method to remove a field that macthes the criteria which in this case is thing: request.body.itemFromJS
//     db.collection('todos').deleteOne({thing: request.body.itemFromJS})
//     // a promise is returned 
//     .then(result => {
//         console.log('Todo Deleted')
//         // a message is logged to the console to confirm the request is successful
//         response.json('Todo Deleted')
//         //json response is sent to confirm that the delete function is carried out
//     })
//     .catch(error => console.error(error))

// })
//setting up the port we will be listening on
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})