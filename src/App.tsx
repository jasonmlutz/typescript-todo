import React, { useState } from "react";
import "./App.css";

function App() {
  const initialTodos: Todo[] = [
    { id: 1, text: "First todo", done: false },
    { id: 2, text: "Second todo", done: false },
  ];

  const [todos, setTodos] = useState(initialTodos);

  interface Todo {
    readonly id: number;
    readonly text: string;
    readonly done: boolean;
  }

  type CompletedTodo = Todo & {
    readonly done: true;
  };

  function toggleTodo(todo: Todo): Todo {
    console.log(`toggle todo ${todo.id}`);
    return {
      ...todo,
      done: !todo.done,
    };
  }

  function completeAll(todos: readonly Todo[]): CompletedTodo[] {
    return todos.map((todo) => ({
      ...todo,
      done: true,
    }));
  }

  const renderedTodos = todos.map((todo: Todo) => (
    <li key={todo.id}>
      {todo.text}
      <button
        onClick={() => {
          // toggleTodo(todo);
          setTodos((prevState) => {
            return [
              ...prevState.filter((el) => el.id !== todo.id),
              toggleTodo(todo),
            ].sort((a, b) => a.id - b.id);
          });
        }}
      >
        {todo.done ? "undo" : "complete"}
      </button>
    </li>
  ));

  return (
    <div className="App">
      <ul>{renderedTodos}</ul>
    </div>
  );
}

export default App;
