import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import TodoLoader from './TodoLoader';
import * as todoServices from '../../services/todo-services';
import { vi } from 'vitest';
import { TodoType } from '../../types/todo';

// Mock the todo services using Vitest
vi.mock('../../services/todo-services');

const mockIncompletedTodos = [
  { id: 1, title: 'Todo 1', content: 'Content 1', completed: false, position: 1 },
];

const mockCompletedTodos = [
  { id: 2, title: 'Todo 2', content: 'Content 2', completed: true, position: 2 },
];

beforeEach(() => {
  (todoServices.fetchTodos as any).mockImplementation((completed: boolean) => {
    return completed ? Promise.resolve(mockCompletedTodos) : Promise.resolve(mockIncompletedTodos);
  });
  (todoServices.createTodo as any).mockImplementation(async (todo: TodoType) => ({ ...todo, id: Date.now() }));
  (todoServices.updateTodo as any).mockImplementation(async (todo: TodoType) => todo);
  (todoServices.deleteTodo as any).mockResolvedValueOnce({});
});

test('loads and displays complete and incomplete todos', async () => {
  render(<TodoLoader />);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Todo 2/i)).toBeInTheDocument();
  });
});

test('creates a new todo', async () => {
  render(<TodoLoader />);

  const newGoalButton = screen.getByTestId('new-goal-button');
  fireEvent.click(newGoalButton);

  const titleInput = screen.getByTestId('title-input');
  const contentInput = screen.getByTestId('content-input');

  fireEvent.change(titleInput, { target: { value: 'New Todo' } });
  fireEvent.change(contentInput, { target: { value: 'New Content' } });

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(screen.getByText(/New Todo/i)).toBeInTheDocument();
    expect(screen.getByText(/New Content/i)).toBeInTheDocument();
  });
});

test('updates an existing todo', async () => {
  render(<TodoLoader />);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
  });

  const editButton = screen.getByTestId('edit-todo-1');
  fireEvent.click(editButton);

  const titleInput = screen.getByTestId('title-input');
  fireEvent.change(titleInput, { target: { value: '' } });
  fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(screen.getByText(/Updated Todo/i)).toBeInTheDocument();
  });
});


test('deletes a todo', async () => {
  render(<TodoLoader />);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
  });

  const todoElement = screen.getByTestId('todo-1');
  const deleteButton = within(todoElement).getByTestId('delete-todo-1');

  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText(/Todo 1/i)).not.toBeInTheDocument();
  });
});


test('clears the form fields when clear button is clicked', async () => {
  render(<TodoLoader />);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
  });

  const editButton = screen.getByTestId('edit-todo-1');
  fireEvent.click(editButton);

  const titleInput = screen.getByTestId('title-input');
  const contentInput = screen.getByTestId('content-input');

  fireEvent.change(titleInput, { target: { value: 'Changed Title' } });
  fireEvent.change(contentInput, { target: { value: 'Changed Content' } });

  expect(titleInput).toHaveValue('Changed Title');
  expect(contentInput).toHaveValue('Changed Content');

  const clearButton = screen.getByTestId('clear-button');
  fireEvent.click(clearButton);

  expect(titleInput).toHaveValue('');
  expect(contentInput).toHaveValue('');
});

test('moves todo from incomplete to complete', async () => {
  render(<TodoLoader />);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Done & Dusted!/i)).toBeInTheDocument();
  });

  const todoItem = screen.getByText(/Todo 1/i);

  fireEvent.dragStart(todoItem);

  const completedGrid = screen.getByTestId('completed-grid');
  fireEvent.dragEnter(completedGrid);
  fireEvent.drop(completedGrid);

  await waitFor(() => {
    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
  });
});
