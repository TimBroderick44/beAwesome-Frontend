import { render, screen } from '@testing-library/react';
import TodoGrid from './TodoGrid';

const mockIncompletedTodos = [
  { id: 1, title: 'Todo 1', content: 'Content 1', completed: false, position: 1 },
];

const mockCompletedTodos = [
  { id: 2, title: 'Todo 2', content: 'Content 2', completed: true, position: 2 },
];

test('renders incomplete TodoGrid with todos', () => {
  render(
    <TodoGrid
      title="What I Need to Do:"
      todos={mockIncompletedTodos}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      allowEditing={true}
      gridId="incompleted-grid"
    />
  );

  expect(screen.getByText(/Todo 1/i)).toBeInTheDocument();
});

test('renders empty incomplete TodoGrid', () => {
  render(
    <TodoGrid
      title="What I Need to Do:"
      todos={[]}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      allowEditing={true}
      gridId="incompleted-grid"
    />
  );

  expect(screen.getByText(/Start planning! Get started on something!/i)).toBeInTheDocument();
});

test('renders completed TodoGrid with todos', () => {
  render(
    <TodoGrid
      title="Done & Dusted!"
      todos={mockCompletedTodos}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      allowEditing={true}
      gridId="completed-grid"
    />
  );

  expect(screen.getByText(/Todo 2/i)).toBeInTheDocument();
});

test('renders empty completed TodoGrid', () => {
  render(
    <TodoGrid
      title="Done & Dusted!"
      todos={[]}
      deleteTodo={() => {}}
      onCancel={() => {}}
      onUpdate={() => {}}
      onSave={() => {}}
      onEditChange={() => {}}
      allowEditing={true}
      gridId="completed-grid"
    />
  );

  expect(screen.getByText(/...You haven't completed anything yet./i)).toBeInTheDocument();
});