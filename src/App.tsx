import React, { SyntheticEvent, useState } from "react";

function App() {
  const initialTodos: Todo[] = [
    { id: 1, text: "Walk the dog", done: false, place: "home" },
    { id: 2, text: "Finish project proposal", done: false, place: "work" },
    { id: 3, text: "Buy groceries", done: false, place: { custom: "market" } },
    { id: 4, text: "Be mindful", done: false },
  ];

  const initialNewTodo: NewTodo = { text: "" };

  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState(initialNewTodo);

  type NewTodo = {
    text: string;
    place?: Place;
  };

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

  function addTodo(todo: Todo): void {
    setTodos((prevState) => {
      return [...prevState, todo];
    });
  }

  function nextTodoIndex(todos: readonly Todo[]): number {
    return Math.max(...todos.map((el) => el.id)) + 1;
  }

  function buildTodo(): Todo {
    return { ...newTodo, id: nextTodoIndex(todos), done: false };
  }

  function submitNewTodo(e: SyntheticEvent): void {
    e.preventDefault();
    if (newTodo.text) {
      let todo = buildTodo();
      addTodo(todo);
      setNewTodo(initialNewTodo);
    } else {
      window.alert("please enter todo text");
    }
  }

  const renderedTodos = todos
    .sort((a, b) => a.id - b.id)
    .map((todo: Todo) => (
      <li key={todo.id} className="mb-2 flex flex-row justify-between">
        <div
          className={
            "flex-1 " + (todo.done ? "line-through text-gray-700" : "")
          }
        >
          {todo.text}
        </div>
        {todo.place ? (
          <div className="ml-2 p-2 rounded-md border border:black bg-white">
            {placeToString(todo.place)}
          </div>
        ) : null}
        <button
          className="p-2 ml-2 rounded-md bg-black text-white hover:bg-gray-600 cursor-pointer w-24"
          onClick={() => {
            // toggleTodo(todo);
            setTodos((prevState) => {
              return [
                ...prevState.filter((el) => el.id !== todo.id),
                toggleTodo(todo),
              ];
            });
          }}
        >
          {todo.done ? "undo" : "complete"}
        </button>
      </li>
    ));

  return (
    <div className="container mx-auto flex flex-col items-center">
      <header className="mb-2 text-2xl">TODOS</header>
      <ul className="w-1/2">{renderedTodos}</ul>
      <button
        className="p-2 mb-2 rounded-md bg-black text-white hover:bg-gray-600 cursor-pointer"
        onClick={() => setTodos((prevState) => completeAll(prevState))}
      >
        complete all
      </button>
      <form className="flex flex-row pb-2" onSubmit={submitNewTodo}>
        <input
          placeholder="todo text"
          className="border border-black w-64 pl-2 flex-1"
          value={newTodo.text}
          onChange={(e) => setNewTodo({ text: e.target.value })}
        />
        <input
          id="newTodoSubmit"
          type="submit"
          value="Add todo"
          className={
            "p-2 ml-2 rounded-md bg-black text-white " +
            (newTodo.text
              ? "hover:bg-gray-600 cursor-pointer"
              : "bg-gray-600 cursor-not-allowed")
          }
        />
      </form>
    </div>
  );
}

export default App;
