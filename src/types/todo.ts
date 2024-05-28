export interface TodoType {
  id: number;
  title: string;
  content: string;
  isFirstEdit?: boolean;
  isEditing?: boolean;
  completed: boolean;
  position: number;
}