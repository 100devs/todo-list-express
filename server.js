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
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (req, res)=>{
    const todoList = await db.collection('todo-list').find().toArray()
    const taskLeft = await db.collection('todo-list').countDocuments({completed: false})

    res.render(('index.ejs'), {todoItems: todoList, tasksLeft : taskLeft})
})

app.post('/addTodo', (req, res) => {
    db.collection('todo-list').insertOne({task: req.body.todoItem, completed: false})
    .then(result => {
        res.redirect('/')
    })
    .catch(err => {
        console.log(err)
    })
})

app.put('/markComplete', (req, res) => {
    db.collection('todo-list').updateOne({task: req.body.todoName},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (req, res) => {
    db.collection('todo-list').updateOne({task: req.body.todoName},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/updateTask', async(req, res) => {
    await db.collection('todo-list').findOneAndUpdate(
        {task: req.body.todoName},
        {
            $set : {
                task: 'I was just updated'
            }
        },
        {
            sort: {_id: -1},
            upsert: false
        }
    )
    .then(result => {
      console.log('Todo updated')
      res.json(`Updating todo item`)

     })
    .catch(error => console.error(error))
})

app.delete('/deleteItem', (req, res) => {
    db.collection('todo-list').deleteOne({task: req.body.todoName})
    .then(result => {
        console.log('Todo Deleted')
        res.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})