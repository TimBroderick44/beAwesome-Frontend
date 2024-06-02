import { TodoType } from "../types/todo";
import { CreateTodo } from "../types/createtodo";

export const fetchTodos = async (): Promise<TodoType[]> => {
  try {
    const response = await fetch(`http://localhost:8080/todos`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!Array.isArray(data)){
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch todos failed: ${error.message}`);
    } else {
      throw new Error('Fetch todos failed: An unknown error occurred');
    }
  }
};

export const createTodo = async (todo: CreateTodo): Promise<TodoType> => {
  try {
    const response = await fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!data || !data.id) {
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create todo failed: ${error.message}`);
    } else {
      throw new Error('Create todo failed: An unknown error occurred');
    }
  }
};

export const updateTodo = async (todo: TodoType): Promise<TodoType> => {
  try {
    const response = await fetch(`http://localhost:8080/todos/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!data || !data.id) {
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update todo failed: ${error.message}`);
    } else {
      throw new Error('Update todo failed: An unknown error occurred');
    }
  }
};  

export const deleteTodo = async (id: number): Promise<unknown> => {
  try {
    const response = await fetch(`http://localhost:8080/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete');
    }
    return response.status === 204 ? {} : response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete todo failed: ${error.message}`);
    } else {
      throw new Error('Delete todo failed: An unknown error occurred');
    }
  }
};
