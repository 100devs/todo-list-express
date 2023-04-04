const Todo = require('../models/Todo')

module.exports = {
    getTask: async (req,res) => {
        try {
            const todoItems = await Todo.find()
            const itemsLeft = await Todo.countDocuments({completed: false})

            res.render('todo.ejs', {todos: todoItems, left: itemsLeft})
        } catch (err) {
          console.log(err)  
        }
    },

    createTask: async(req,res) => {
        try {
            await Todo.create({todo: req.body.todoItem, completed: false})
            console.log('Task has been added')
            res.redirect('/todos')
        } catch (err) {
            console.log(err)
        }
    },

    markTask: async(req,res) => {
        try {
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log("Task marked as complete")
            res.json('Marked Complete')
        } catch (err) {
            console.log(err)
        }
    },

    unmarkTask: async(req, res) =>{
        try {
            await Todo.findOneAndUpdate({_id: req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Task is marked as incomplete')
            res.json('Marked Incomplete')
        } catch (err) {
            console.log(err)
        }
    },

    deleteTask: async(req,res) => {
        console.log(req.body.todoIdFromJSFile)
        try {
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile
            })
            console.log('Task is deleted')
            res.json(`Deleted Task`)
        } catch (err) {
        console.log(err)            
        }
    }
}

