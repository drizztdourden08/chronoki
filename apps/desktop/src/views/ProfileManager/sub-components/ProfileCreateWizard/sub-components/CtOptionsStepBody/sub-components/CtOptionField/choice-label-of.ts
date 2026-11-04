/* @layer renderer-components @kind logic */
const choiceLabelOf = (choice: unknown): string => {
  const text = String(choice);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export { choiceLabelOf };
