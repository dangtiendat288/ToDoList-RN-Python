import axios from "axios";

// Replace with your FastAPI server URL
const API_URL = "http://localhost:8000";

export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
}

export class TodoService {
  static async getAllTodos(): Promise<Todo[]> {
    const response = await axios.get(`${API_URL}/todos/`);
    return response.data;
  }

  static async getTodoById(id: number): Promise<Todo> {
    const response = await axios.get(`${API_URL}/todos/${id}`);
    return response.data;
  }

  static async createTodo(todo: Todo): Promise<Todo> {
    const response = await axios.post(`${API_URL}/todos/`, todo);
    return response.data;
  }

  static async updateTodo(id: number, todo: Todo): Promise<Todo> {
    const response = await axios.put(`${API_URL}/todos/${id}`, todo);
    return response.data;
  }

  static async deleteTodo(id: number): Promise<void> {
    await axios.delete(`${API_URL}/todos/${id}`);
  }
}
