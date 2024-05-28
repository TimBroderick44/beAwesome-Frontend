import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todo';
import { vi } from 'vitest';

const mockTodo = { id: 1, title: 'Todo 1', content: 'Content 1', completed: false, position: 1 };

test('renders Todo', () => {
  render(
    <Todo
      {...mockTodo}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      isEditing={false}
      allowEditing={true}
    />
  );

  expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
});

test('toggles edit mode', () => {
  render(
    <Todo
      {...mockTodo}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      isEditing={false}
      allowEditing={true}
    />
  );

  const editButton = screen.getByAltText('pencil');
  fireEvent.click(editButton);

  expect(screen.getByTestId('title-input')).toBeInTheDocument();
  expect(screen.getByTestId('content-input')).toBeInTheDocument();
});

test('handles delete action', () => {
  const deleteTodo = vi.fn();

  render(
    <Todo
      {...mockTodo}
      deleteTodo={deleteTodo}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      isEditing={false}
      allowEditing={true}
    />
  );

  const deleteButton = screen.getByTestId('delete-todo-1');
  fireEvent.click(deleteButton);

  expect(deleteTodo).toHaveBeenCalledWith(1);
});
