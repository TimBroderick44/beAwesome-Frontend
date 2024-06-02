import React, { useState } from "react";
import style from "./EditTodoForm.module.scss";

interface EditTodoFormProps {
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => unknown;
  onCancel: () => unknown;
  dataTestId?: string;
}

const EditTodoForm: React.FC<EditTodoFormProps> = ({ initialTitle, initialContent, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(title, content);
  };

  const onClear = () => {
    setTitle("");
    setContent("");
  };

  return (
    <div className={style.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className={style.input}
        data-testid="title-input"    
        />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How are you going to get it done?!"
        className={style.content}
        data-testid="content-input"  
        />
      <div className={style.buttons}>
        <button className={style.save} onClick={handleSave} data-testid="save-button">
          Save
        </button>
        <button className={style.clear} onClick={onClear} data-testid="clear-button">
          Clear
        </button>
        <button className={style.cancel} onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditTodoForm;
