// Initilizes Express//
const express = require('express')

// stores Express into the "app" variable//

const app = express()

//Initializes MongoDB and stores it in the MongoClient variable//

const MongoClient = require('mongodb').MongoClient

//Sets the value and the location of PORT which I think is the url after the localhost://  
const PORT = 2121


//Iniitializes dotenv that allows apikeys, and other sensitive information such as passwords away from the code. Allows us to create environment variables .env file instead of putting them in our code//
require('dotenv').config()


//Initializes a database, such as MongoDB (but not in this case maybe). The environment variable of DB_STRING is being put into the variable dbConnectionStr -- the information necessary to connect to the database. The database is assigned with the value 'todo' which in this case is the name of the database.//

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })

    //This line is used to connect the mongodb client to the dbConnectionStr to gain access to our database. The parameter dbConnectionStr is the information that's necessary for us to connect to the database and integrate it with the mongoclient database client. useUnifiedTopology is set to True for a modern and consistent approach at how the driver (the interface between application and database) manages connections and performs server discovery and monitoring. 

    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

   //.then is used as a Promise,in which if the promise gets fulfilled then the client gets to use the method console.log to output "Connected to 'todo' Database"). Then the client.db(todo) is assigned to the variable of db (Which was initialzied early on). Client represents the mongodbclient that allows us to perform operations on the database. //


app.set('view engine', 'ejs')

// app.set is an express method. View engine determines which template engine will be used. EJS is the template engine that will be used whcih stands for embedded javascript. 

//following are middlewares that allow reading and responding and modifiyingthe objects ..

app.use(express.static('public'))
//app *express* retrieves static files (files that are always similar such as html, css, images, etc) from the directory of PUBLIC folder. express.static is also a middleware 


app.use(express.urlencoded({ extended: true }))
//middleware that parses data into qs library. It allows for rich objects and ararys to be encoded in URL-encoded format. Allows formore comlpex representative of nested objects/ All are part of the epxress framework//


app.use(express.json())
//middlware that allows server to understand and proces JSON data by converting it to javascript. After processing of the data in javascript, it makes it available on req.body, making it easy to work on router handlers (i wonder what those are)//




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

//app get allows client to make a server side READ request on the homepage which is denoted by '/' as the first parameter on the app.get method. it takes in two parameters, request and response. On the request part, it undertakes what it has received. On the response side, it responds with the following. It assigns toDoItems variable to convert the todo database collection on the mongodb to find for relevant todo item and converts it into an array. The next line of code returns the number of documents that i think has not been completed. It then responds by rendering the information on index.ejs that allows html file to apply javascript and shows items and todoItems, and left: itemsLeft?? wait a secon, I think i get it but let me chatgpt it anyway to articulate it better :D Ok so response.render takes two arguments (index.ejs)

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//app.post allows the collection to insert (OR UPDATE) one more item. it then console logs if succesfull with todo added, and refreshes the page. the error states error in case it doesnt work. the thing: request.body.todoItem is i think the prased value from json to refer to the todoitem, followed by whether it'scompleted or not. if completed then true, otherwise false. It also sets it to descending order.

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

//the put request receives information from the endpoint markUnComplete and updates the item as false. It continues to stay in descending order which i dont fully understand line by line but understand the big picture. it then prints complete and sends client side back the json file I think?? with additional details marked comlpete Not quite sure. 


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

// app.delete deletes one single item from the server


app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


//The listen process initializes the server, value of whihc is pushed by servers like heroku or others OR as either the self defined hard coded value

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
