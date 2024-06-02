import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import style from "./Todo.module.scss";
import EditTodoForm from "../TodoEditForm/EditTodoForm";
import pencil from "../../assets/pencil.png";
import trash from "../../assets/trash.png";
import { TodoType } from "../../types/todo";

interface TodoProps {
  id: number;
  title: string;
  content: string;
  deleteTodo: (id: number) => unknown;
  isFirstEdit?: boolean;
  onCancel: (id: number, isFirstEdit: boolean) => unknown;
  onUpdate: (id: number, newTitle: string, newContent: string, completed: boolean, position: number) => unknown;
  onSave: (tempId: number, newTodo: Omit<TodoType, 'id'>) => unknown;
  onEditChange: (id: number, isEditing: boolean) => unknown;
  isEditing: boolean;
  allowEditing: boolean;
  completed: boolean;
  position: number;
}

const Todo: React.FC<TodoProps> = ({
  id,
  title,
  content,
  deleteTodo,
  isFirstEdit,
  onCancel,
  onUpdate,
  onSave,
  onEditChange,
  isEditing,
  allowEditing,
  completed,
  position,
}) => {
  const [isEditingState, setIsEditing] = useState<boolean>(isEditing);

  useEffect(() => {
    onEditChange(id, isEditingState);
  }, [isEditingState]);

  const handleUpdate = (newTitle: string, newContent: string) => {
    if (!newTitle.trim()) {
      toast.error("You at least need a title!");
      return;
    }
    if (isFirstEdit) {
      onSave(id, { title: newTitle, content: newContent, completed, position });
    } else {
      onUpdate(id, newTitle, newContent, completed, position);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    onCancel(id, isFirstEdit ?? false);
    setIsEditing(false);
  };

  return (
    <div className={style.todo} data-testid={`todo-${id}`}>
      {isEditingState && allowEditing ? (
        <EditTodoForm
          initialTitle={title}
          initialContent={content}
          onSave={handleUpdate}
          onCancel={handleCancel}
          dataTestId={`edit-form-${id}`}        
          />
      ) : (
        <>
          {allowEditing && <img src={pencil} alt="pencil" className={style.pencil} onClick={() => setIsEditing(true)} data-testid={`edit-todo-${id}`} />}
          <h3 className={style.heading}>{title}</h3>
          <p className={style.content}>{content}</p>
          <div className={style.buttons}>
            <img src={trash} alt="trash" className={style.trash} onClick={() => deleteTodo(id)} data-testid={`delete-todo-${id}`} />
          </div>
        </>
      )}
    </div>
  );
};

export default Todo;
