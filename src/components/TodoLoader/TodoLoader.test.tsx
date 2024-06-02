import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { ToastContainer, toast } from 'react-toastify';
import '@testing-library/jest-dom';
import TodoLoader from './TodoLoader';
import * as todoServices from '../../services/todo-services';
import { test, vi } from 'vitest';
import { TodoType } from '../../types/todo';

vi.mock('../../services/todo-services');
vi.mock('react-toastify', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-toastify')>();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const mockTodos = [
  { id: 1, title: 'Todo 1', content: 'Content 1', completed: false, position: 1 },
  { id: 2, title: 'Todo 2', content: 'Content 2', completed: true, position: 2 },
];

beforeEach(() => {
  (todoServices.fetchTodos as any).mockResolvedValue(mockTodos);
  (todoServices.createTodo as any).mockImplementation(async (todo) => ({ ...todo, id: Date.now() }));
  (todoServices.updateTodo as any).mockImplementation(async (todo) => todo);
  (todoServices.deleteTodo as any).mockResolvedValueOnce({});
  vi.clearAllMocks();
});

test('loads and displays todos', async () => {
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => {
    expect(screen.getByText('What I Need to Do:')).toBeInTheDocument();
    expect(screen.getByText('Done & Dusted!')).toBeInTheDocument();
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
});

test('handles fetchTodos error', async () => {
  (todoServices.fetchTodos as any).mockRejectedValueOnce(new Error('Fetch error'));

  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Fetch error');
  });
});

test('creates a new todo', async () => {
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  fireEvent.click(screen.getByTestId('new-goal-button'));

  const titleInput = screen.getByTestId('title-input');
  const contentInput = screen.getByTestId('content-input');

  fireEvent.change(titleInput, { target: { value: 'New Todo' } });
  fireEvent.change(contentInput, { target: { value: 'New Content' } });

  fireEvent.click(screen.getByTestId('save-button'));

  await waitFor(() => {
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("Let's get it done!");
  });
});

test('handles createTodo error', async () => {
  (todoServices.createTodo as any).mockRejectedValueOnce(new Error('Create error'));

  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  fireEvent.click(screen.getByTestId('new-goal-button'));

  const titleInput = screen.getByTestId('title-input');
  const contentInput = screen.getByTestId('content-input');

  fireEvent.change(titleInput, { target: { value: 'New Todo' } });
  fireEvent.change(contentInput, { target: { value: 'New Content' } });

  fireEvent.click(screen.getByTestId('save-button'));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Create error');
  });
});

test('updates a todo', async () => {
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => screen.getByText('Todo 1'));

  fireEvent.click(screen.getByTestId('edit-todo-1'));

  const titleInput = screen.getByTestId('title-input');
  fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(screen.getByText('Updated Todo')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Updated successfully!');
  });
});

test('handles updateTodo error', async () => {
  (todoServices.updateTodo as any).mockRejectedValueOnce(new Error('Update error'));

  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => screen.getByText('Todo 1'));

  fireEvent.click(screen.getByTestId('edit-todo-1'));

  const titleInput = screen.getByTestId('title-input');
  fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Update error');
  });
});

test('deletes a todo', async () => {
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => screen.getByText('Todo 1'));

  const todoElement = screen.getByTestId('todo-1');
  const deleteButton = within(todoElement).getByTestId('delete-todo-1');

  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
  });
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Out of sight, out of mind');
  });
});

test('handles deleteTodo error', async () => {
  (todoServices.deleteTodo as any).mockRejectedValueOnce(new Error('Delete error'));

  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => screen.getByText('Todo 1'));

  const todoElement = screen.getByTestId('todo-1');
  const deleteButton = within(todoElement).getByTestId('delete-todo-1');

  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Delete error');
  });
});

test('clears the form fields when clear button is clicked', async () => {
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => screen.getByText('Todo 1'));

  fireEvent.click(screen.getByTestId('edit-todo-1'));

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
  render(
    <>
      <ToastContainer />
      <TodoLoader />
    </>
  );

  await waitFor(() => {
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Done & Dusted!')).toBeInTheDocument();
  });

  const todoItem = screen.getByText('Todo 1');

  fireEvent.dragStart(todoItem);

  const completedGrid = screen.getByTestId('completed-grid');
  fireEvent.dragEnter(completedGrid);
  fireEvent.drop(completedGrid);

  await waitFor(() => {
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
  });
});
