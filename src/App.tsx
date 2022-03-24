import React, { useState } from "react";

function App() {
  const initialTodos: Todo[] = [
    { id: 1, text: "Walk the dog", done: false, place: "home" },
    { id: 2, text: "Finish project proposal", done: false, place: "work" },
    { id: 3, text: "Buy groceries", done: false, place: { custom: "market" } },
    { id: 4, text: "Be mindful", done: false },
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

  function placeToString(place: Place): string | null {
    // Takes a Place and returns a string
    // that can be used for the place label UI
    if (place === "home" || place === "work") {
      return place;
    } else if (place.custom.length) {
      return place.custom;
    } else {
      return null;
    }
  }

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
    <li key={todo.id} className="mb-2 flex flex-row justify-between">
      <div
        className={"flex-1 " + (todo.done ? "line-through text-gray-700" : "")}
      >
        {todo.text}
      </div>
      {todo.place ? (
        <div className="ml-2 p-2 rounded-md border border:black bg-white">
          {placeToString(todo.place)}
        </div>
      ) : null}
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
