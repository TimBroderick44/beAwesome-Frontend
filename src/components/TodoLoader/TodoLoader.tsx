import { useEffect, useState } from "react";
import { useSensor, useSensors, MouseSensor, TouchSensor, DragEndEvent, DndContext, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import TodoGrid from "../TodoGrid/TodoGrid";
import Flexbox from "../../containers/Flexbox/Flexbox.tsx";
import { fetchTodos, deleteTodo, updateTodo, createTodo } from "../../services/todo-services";
import { arrayMove } from "@dnd-kit/sortable";
import { TodoType } from "../../types/todo.tsx";
import { toast } from "react-toastify";
import Todo from "../Todo/Todo";
import style from "./TodoLoader.module.scss";

const TodoLoader: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const incompletedData = await fetchTodos(false);
        const completedData = await fetchTodos(true);
        setTodos([...incompletedData, ...completedData].map(todo => ({ ...todo, isEditing: false })));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    loadTodos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
      toast.success("Out of sight, out of mind");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleCreate = () => {
    const newTodo: TodoType = {
      id: Date.now(),
      title: "",
      content: "",
      isFirstEdit: true,
      isEditing: true,
      completed: false,
      position: todos.filter(todo => !todo.completed).length + 1
    };
    setTodos([...todos, newTodo]);
  };

  const handleSave = async (tempId: number, newTodo: Omit<TodoType, 'id'>) => {
    if (!newTodo.title.trim()) {
      toast.error("You at least need a title!");
      return;
    }

    try {
      const data = await createTodo(newTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === tempId ? { ...data, isFirstEdit: false, isEditing: false } : todo
        )
      );
      toast.success("New goal created! Now, let's get it done!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleUpdate = async (id: number, newTitle: string, newContent: string, completed: boolean, position: number) => {
    if (!newTitle.trim()) {
      toast.error("You at least need a title!");
      return;
    }

    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
      toast.error("Todo not found");
      return;
    }

    if (newTitle === todo.title && newContent === todo.content && completed === todo.completed && position === todo.position) {
      toast.info("No changes were made.");
      return;
    }

    try {
      const updatedTodo = { ...todo, title: newTitle, content: newContent, completed, position };
      await updateTodo({
        id: updatedTodo.id,
        title: updatedTodo.title,
        content: updatedTodo.content,
        completed: updatedTodo.completed,
        position: updatedTodo.position
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...updatedTodo, isEditing: false } : todo
        )
      );
      toast.success("Todo updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const handleCancel = (id: number, isFirstEdit: boolean) => {
    if (isFirstEdit) {
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, isEditing: false } : todo)));
    }
  };

  const handleEditChange = (id: number, isEditing: boolean) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, isEditing } : todo)));
  };

  
  const handleDragStart = (event: DragStartEvent) => {
    // The id of the element being dragged
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    // Deconstruct the event to get the active and over properties
    const { active, over } = event;

    // If there is no over or active element, set activeId to null and return
    if (!over || !active) {
      setActiveId(null);
      return;
    }

    // Find the active todo in the todos array
    const activeTodo = todos.find(todo => todo.id === active.id);
    if (!activeTodo) {
      setActiveId(null);
      return;
    }

    // Determine if the over container is the completed grid or the incompleted grid
    const overContainer = over.id === 'completed-grid' ? true : over.id === 'incompleted-grid' ? false : activeTodo.completed;

    // If not already in that container, update the todo
    if (activeTodo.completed !== overContainer) {
      const updatedTodo = { ...activeTodo, completed: overContainer, position: todos.length };
      try {
        await updateTodo({
          id: updatedTodo.id,
          title: updatedTodo.title,
          content: updatedTodo.content,
          completed: updatedTodo.completed,
          position: updatedTodo.position
        });
        setTodos((items) =>
          items.map((todo) => (todo.id === active.id ? updatedTodo : todo))
        );
        if (overContainer) {
          toast.success("Let's get this done!");
        } else {
          toast.success("Let's have another go at it!");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } else {
      // If the same container, just update the position of the todos
      const oldIndex = todos.indexOf(activeTodo);
      // Find the index of the todo being dragged over
      const newIndex = todos.indexOf(todos.find(todo => todo.id === over.id)!);
      // arrayMove is part of dndkit and does the heavy lifting of moving the todos
      const updatedTodos = arrayMove(todos, oldIndex, newIndex);
      setTodos(updatedTodos);

      // Update the position of the todos in the database
      for (let i = 0; i < updatedTodos.length; i++) {
        await updateTodo({
          id: updatedTodos[i].id,
          title: updatedTodos[i].title,
          content: updatedTodos[i].content,
          completed: updatedTodos[i].completed,
          position: i + 1
        });
      }
    }

    setActiveId(null);
  };

  // Without a delay, registers everything as the start of a drag (e.g. clicking edit or delete button)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
  );

  const incompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const activeTodo = todos.find(todo => todo.id === activeId) || null;
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Flexbox flexdirection="row" gap={20}>
        <TodoGrid
          title="What I Need to Do:"
          todos={incompletedTodos}
          deleteTodo={handleDelete}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
          onSave={handleSave}
          onEditChange={handleEditChange}
          allowEditing={true}
          gridId="incompleted-grid"
        />
        <TodoGrid
          title="Done & Dusted!"
          todos={completedTodos}
          deleteTodo={handleDelete}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
          onSave={handleSave}
          onEditChange={handleEditChange}
          allowEditing={false}
          gridId="completed-grid"
        />
      </Flexbox>
      <DragOverlay
        dropAnimation={null}
      >
        {activeTodo ? (
          <Todo
            id={activeTodo.id}
            title={activeTodo.title}
            content={activeTodo.content}
            deleteTodo={handleDelete}
            isFirstEdit={activeTodo.isFirstEdit}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
            onSave={handleSave}
            onEditChange={handleEditChange}
            isEditing={false}
            allowEditing={!activeTodo.completed}
            completed={activeTodo.completed}
            position={activeTodo.position}
          />
        ) : null}
      </DragOverlay>
      <button className={style.createButton} onClick={handleCreate} data-testid="new-goal-button">New Goal</button>
    </DndContext>
  );
};

export default TodoLoader;
