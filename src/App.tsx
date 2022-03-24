import React, { useState } from "react";

function App() {
  const initialTodos: Todo[] = [
    { id: 1, text: "First todo", done: false },
    { id: 2, text: "Second todo", done: false },
  ];

  const [todos, setTodos] = useState(initialTodos);

  type Place = "home" | "work" | { custom: string };
  type Todo = Readonly<{
    id: number;
    text: string;
    done: boolean;
    place?: Place;
  }>;

  type CompletedTodo = Todo & {
    readonly done: true;
  };

  function toggleTodo(todo: Todo): Todo {
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
    <li
      key={todo.id}
      className={"mb-2 " + (todo.done ? "line-through text-gray-700" : "")}
    >
      {todo.text}
      <button
        className="p-2 ml-2 rounded-md bg-black text-white hover:bg-gray-600 w-24"
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
    <div className="container mx-auto bg-gray-300 flex flex-col items-center mb-2">
      <header className="mb-2 text-2xl">TODOS</header>
      <ul className="">{renderedTodos}</ul>
      <button
        className="p-2 mb-2 rounded-md bg-black text-white hover:bg-gray-600"
        onClick={() => setTodos((prevState) => completeAll(prevState))}
      >
        complete all
      </button>
    </div>
  );
}

export default App;
