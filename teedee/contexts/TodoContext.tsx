import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { TodoService, Todo } from "../services/TodoService";

interface TodoContextType {
  todos: Todo[] | null;
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Todo) => Promise<void>;
  updateTodo: (id: number, todo: Todo) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextType>({
  todos: null,
  loading: false,
  error: null,
  fetchTodos: async () => { },
  addTodo: async () => { },
  updateTodo: async () => { },
  deleteTodo: async () => { },
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TodoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo: Todo) => {
    try {
      setLoading(true);
      setError(null);
      const newTodo = await TodoService.createTodo(todo);
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError("Failed to add todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: number, todo: Todo) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTodo = await TodoService.updateTodo(id, todo);
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await TodoService.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const contextData = {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
  return (
    <TodoContext.Provider value={contextData}>{children}</TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
