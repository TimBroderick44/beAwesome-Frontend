import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import style from "./TodoGrid.module.scss";
import { TodoType } from '../../types/todo.tsx';
import SortableTodo from '../SortableTodo/SortableTodo.tsx';

interface TodoGridProps {
  title: string;
  todos: TodoType[];
  deleteTodo: (id: number) => unknown;
  onCancel: (id: number, isFirstEdit: boolean) => unknown;
  onUpdate: (id: number, newTitle: string, newContent: string, completed: boolean, position: number) => unknown;
  onSave: (tempId: number, newTodo: Omit<TodoType, 'id'>) => unknown;
  onEditChange: (id: number, isEditing: boolean) => unknown;
  allowEditing: boolean;
  gridId: string;
}

const TodoGrid: React.FC<TodoGridProps> = ({ title, todos, deleteTodo, onCancel, onUpdate, onSave, onEditChange, allowEditing, gridId }) => {
  const { setNodeRef } = useDroppable({
    id: gridId,
  });

  return (
    <div className={style.gridContainer} data-testid={gridId}>
      <SortableContext items={todos.map(todo => todo.id)} strategy={horizontalListSortingStrategy}>
        <div ref={setNodeRef} id={gridId} className={style.todosContainer}>
          <h2 className={style.heading}>{title}</h2>
          <div className={style.posts}>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <SortableTodo
                key={todo.id}
                todo={todo}
                deleteTodo={deleteTodo}
                onCancel={onCancel}
                onUpdate={onUpdate}
                onSave={onSave}
                onEditChange={onEditChange}
                allowEditing={allowEditing}
              />
            ))
          ) : (
            <div className={style.noPosts}>
              { title === "What I Need to Do:" ? "Start planning! Get started on something!" : "...You haven't completed anything yet." }
            </div>
          )}
        </div>
        </div>
      </SortableContext>
    </div>
  );
}

export default TodoGrid;
