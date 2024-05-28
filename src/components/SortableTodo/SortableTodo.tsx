import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Todo from '../Todo/Todo';
import { TodoType } from '../../types/todo';

const SortableTodo: React.FC<{
  todo: TodoType;
  deleteTodo: (id: number) => void;
  onCancel: (id: number, isFirstEdit: boolean) => void;
  onUpdate: (id: number, newTitle: string, newContent: string, completed: boolean, position: number) => void;
  onSave: (tempId: number, newTodo: Omit<TodoType, 'id'>) => void;
  onEditChange: (id: number, isEditing: boolean) => void;
  allowEditing: boolean;
}> = ({ todo, deleteTodo, onCancel, onUpdate, onSave, onEditChange, allowEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: todo.isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(!todo.isEditing && listeners)} data-testid={`sortable-todo-${todo.id}`}>
      <Todo
        id={todo.id}
        title={todo.title}
        content={todo.content}
        deleteTodo={deleteTodo}
        isFirstEdit={todo.isFirstEdit}
        onCancel={onCancel}
        onUpdate={onUpdate}
        onSave={onSave}
        isEditing={todo.isEditing ?? false}
        onEditChange={onEditChange}
        allowEditing={allowEditing}
        completed={todo.completed}
        position={todo.position}
      />
    </div>
  );
};

export default SortableTodo