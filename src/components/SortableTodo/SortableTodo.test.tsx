import { render, screen } from '@testing-library/react';
import SortableTodo from './SortableTodo';

const mockTodo = { id: 1, title: 'Todo 1', content: 'Content 1', completed: false, position: 1 };

test('renders SortableTodo', () => {
  render(
    <SortableTodo
      todo={mockTodo}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      allowEditing={true}
    />
  );

  expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
});
