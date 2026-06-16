export function validateTodoTitle(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return "Task title is required";
  }

  if (trimmedTitle.length > 100) {
    return "Task title must be 100 characters or less";
  }

  return "";
}