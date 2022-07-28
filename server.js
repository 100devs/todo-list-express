const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//^^This above section calls some of the frameworks we'll be using. For example it brings the express framework into the project with require then assigns it to app for ease of use.
//It also chooses a default port for the server, 2121

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//^^This creates variable db with no assignment, dbConnectionStr with the assignment of database connection though the actual connection string is yet to be assigned
//and dbName, a name for the database, which is assigned 'todo'


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//^^this connects to MongoClient, where the database is being stored, using the connection string we assigned earlier. If this process is successful, the code will log
//'Connected to ${dbName} database' where ${dbName} will be 'todo'. The code then assigns the db variable to what I think will call the database.


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//^^ will load a series of modules and tell express to use them, as app is assigned to call express


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//^^This is the first example of CRUD in the server. This is a get request, triggered when the URL tries to navigate to the endpoint, the '/' directory.
//When the request is triggered, the code makes an asynchronous function with request and response as parameters. Within the function we have to assigned variables
//todoItems and itemsLeft. 

//When the request is fulfilled, the result of todoItems will be that the server is contacted and a collection is requested with the name 'todos'
//within the 'todos' collection it will find the items and put them into an array before returning them. Thus the value of todoItems becomes an array of items, the contents
//of the 'todo's collection. itemsLeft does a similar action ot todoItels, exceopt that it goes further inside the collection, returning a count of items within the
//collection with the value of 'false' for the key 'completed'.

//The code then takes the response, an aggregate of everything I have laid out already, and calls index.ejs with an object as a second parameter with a key of 'items'
//set to the array of todoItems, and a second key called 'left' with the value of the number returned by the function assigned to itemsLeft. It parses this information
//onto the webpage dynamically using the code in index.ejs. The commented out code appears to be an older version of the function wherein todoItems and itemsLeft were 
//assigned during the function body rather than asynchronously at the beginning. There is also a commented out catch for errors.

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//^^This is a post request that is triggered when requesting the /addTodo directory. This can happen through a url, through a form or through a fetch, though
//it appears that it was triggered by a form in the html. The code calls the database
//and navigates to the 'todos' collection. The insertOne method inserts a document into the collection where the key is 'thing', assigned to whatever was entered into 
//the form. request.body is what was typed, todoItem is the name assigned to the item inside the input of the form. And the key 'completed' has a default value of false.
//So in object notation, what is being inserted is:
/* { thing: request.body.totoItem,
     completed: false
}
*/
//The code then logs 'Todo Added' to the console and redirects back to the main directory, refreshing the page and showing the newly added item on the list populated by
//index.ejs. There is also a catch handler for errors.
 

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

/* ^^This is a put request that is called by a fetch on the client-side JS. The function on the client-side requests the '/markcomplete' directory which will request
the database collection called 'todo' and call the updateOne method, locating the specific item inside the database with request.body.itemFromJS which is a key provided
from the client-side request again used to navigate to the right item in the collection. The code then uses a setter to change the value of 'completed' inside the 
item to 'true'. It then creates a new object within the item, sorting it to -1 and setting upsert to false. Sorting by -1 sorts the items in the collection in descending
order, and upsert: false just tells the database that it doesn't have to update and create a slot for the item, as it is already present.

All of this fulfilled, the code logs 'Marked complete' to the console and as a response in JSON. There is also a catch handler to handle errors

*/

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

/*^^This essentially performs the same operation as markComplete with the exception that it will mark the item as not having been completed, changing the value of 
'completed' to 'false'

*/

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

/*^^This is a delete request triggered from the client-side JS by an eventListener of 'click' on deleteBtn. This code will find the 'todos' collection in the database
and run the deleteOne method on the item with the value set in itemFromJS, referring to the specific item clicked. It will remove that item from the collection and log 
'Todo Deleted' to the console and the client-side JS. 

There is also a catch handler for errors.

*/

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

//^^This tells express what port to connect to when the server is requested. It will connect to the port provided by the database, or the port variable absent the
//database's port, which is 2121
