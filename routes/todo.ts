import express from 'express';
const router = express.Router();
import todoController from '../controller/todo.ts';

router.get('/', todoController.sendAllTodos)

router.post('/', todoController.addTodo)

router.put('/completion', todoController.toggleCompletion)

router.delete('/:id', todoController.deleteTodo)

export default router