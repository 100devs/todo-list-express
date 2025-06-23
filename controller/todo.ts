import type { Request, Response } from 'express';
import Todo from '../models/todo';
import { validateTodoInput } from '../validators/todoValidator';

export default {
    sendAllTodos: async (req: Request, res: Response) => {
        try {
            const todos = await Todo.find();
            res.json(todos)
        } catch (err) {
            console.error(err)
        }
    },
    addTodo: async (req: any, res: any) => {
        const validation = validateTodoInput(req.body);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }
        
        try {
            // Create and save the new todo
            const todo = new Todo(req.body);
            await todo.save();
            res.status(201).json({ message: 'Todo created', todo });
        } catch (err) {
            res.status(500).json({ error: 'Database error', details: err });
        }
    },
    toggleCompletion: async (req: Request, res: Response) => {
        try {
            const { id, state } = req.body;
            await Todo.findByIdAndUpdate(id, { completed: state });
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error', details: err });
        }
    },
    deleteTodo: async (req: Request, res: Response) => {
        try {
            await Todo.findByIdAndDelete(req.params.id)
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('err')
            res.status(500).json({ error: err });
        }
    }
}