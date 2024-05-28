import { render, screen, fireEvent } from '@testing-library/react';
import EditTodoForm from './EditTodoForm';
import { vi } from 'vitest';

test('renders EditTodoForm', () => {
  render(
    <EditTodoForm
      initialTitle="Todo 1"
      initialContent="Content 1"
      onSave={() => {}}
      onCancel={() => {}}
      dataTestId="edit-form-1"
    />
  );

  expect(screen.getByTestId('title-input')).toHaveValue('Todo 1');
  expect(screen.getByTestId('content-input')).toHaveValue('Content 1');
});

test('handles save action', () => {
  const onSave = vi.fn();

  render(
    <EditTodoForm
      initialTitle="Todo 1"
      initialContent="Content 1"
      onSave={onSave}
      onCancel={() => {}}
      dataTestId="edit-form-1"
    />
  );

  const titleInput = screen.getByTestId('title-input');
  const contentInput = screen.getByTestId('content-input');

  fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });
  fireEvent.change(contentInput, { target: { value: 'Updated Content' } });

  const saveButton = screen.getByTestId('save-button');
  fireEvent.click(saveButton);

  expect(onSave).toHaveBeenCalledWith('Updated Todo', 'Updated Content');
});

test('handles clear action', () => {
  render(
    <EditTodoForm
      initialTitle="Todo 1"
      initialContent="Content 1"
      onSave={() => {}}
      onCancel={() => {}}
      dataTestId="edit-form-1"
    />
  );

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

test('handles cancel action', () => {
  const onCancel = vi.fn();

  render(
    <EditTodoForm
      initialTitle="Todo 1"
      initialContent="Content 1"
      onSave={() => {}}
      onCancel={onCancel}
      dataTestId="edit-form-1"
    />
  );

  const cancelButton = screen.getByTestId('cancel-button');
  fireEvent.click(cancelButton);

  expect(onCancel).toHaveBeenCalled();
});
