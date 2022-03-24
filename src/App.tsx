import React, { SyntheticEvent, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillBriefcaseFill, BsFillPinMapFill, BsTrash } from "react-icons/bs";
import { FaTrashRestoreAlt } from "react-icons/fa";
import { RiCheckboxLine, RiCheckboxBlankLine } from "react-icons/ri";

function App() {
  const initialTodos: Todo[] = [
    {
      id: 1,
      text: "Create a new todo",
      done: false,
      place: "home",
      deleted: false,
    },
    {
      id: 2,
      text: "Delete a todo",
      done: false,
      place: "work",
      deleted: false,
    },
    {
      id: 3,
      text: "Create a todo with a custom location",
      done: false,
      place: { custom: "market" },
      deleted: false,
    },
    { id: 4, text: "Mark all todos as complete", done: false, deleted: false },
    { id: 5, text: "Un-delete a todo", done: false, deleted: true },
  ];

  const initialNewTodo: NewTodo = {
    text: "",
    done: false,
    place: "",
    deleted: false,
  };

  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState(initialNewTodo);
  const [showDeletedTodos, setShowDeletedTodos] = useState(false);

  type NewTodo = {
    id?: number;
    text: string;
    done: false;
    place?: string;
    deleted: false;
  };

  type Todo = Readonly<{
    id: number;
    text: string;
    done: boolean;
    place?: Place;
    deleted: boolean;
  }>;

  type CompletedTodo = Todo & {
    readonly done: true;
  };

  // type DeletedTodo = Todo & {
  //   readonly deleted: true;
  // };

  // type LiveTodo = Todo & {
  //   readonly deleted: false;
  // };

  type Place = "home" | "work" | { custom: string };
  type PlaceLabel = {
    text: string | null;
    icon: JSX.Element | null;
  };

  function placeLabel(place: Place): PlaceLabel {
    if (place === "home") {
      return { text: null, icon: <AiOutlineHome /> };
    }
    if (place === "work") {
      return { text: null, icon: <BsFillBriefcaseFill /> };
    }
    if (place.custom) {
      return {
        text: place.custom,
        icon: <BsFillPinMapFill />,
      };
    }
    return { text: null, icon: null };
  }

  function toggleCompleteTodo(todo: Todo): Todo {
    return {
      ...todo,
      done: !todo.done,
    };
  }

  function toggleDeleteTodo(todo: Todo): Todo {
    return {
      ...todo,
      deleted: !todo.deleted,
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
    if (!newTodo.place) {
      return {
        text: newTodo.text,
        id: nextTodoIndex(todos),
        done: false,
        deleted: false,
      };
    } else {
      // parse the place as home, work, or custom
      return {
        text: newTodo.text,
        id: nextTodoIndex(todos),
        done: false,
        deleted: false,
        place:
          newTodo.place === "home" || newTodo.place === "work"
            ? newTodo.place
            : { custom: newTodo.place },
      };
    }
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

  function getLocations(): string[] {
    // return the possible choices for locations for todo items
    // ["home", "work"] + all custom locations previously used
    let choices: string[] = ["home", "work"];
    todos.forEach((todo) => {
      if (todo.place && todo.place !== "home" && todo.place !== "work") {
        choices.push(todo.place.custom.toLowerCase());
      }
    });
    return choices;
  }

  const locationChoices: JSX.Element[] = getLocations().map(
    (location, index) => (
      <li
        key={index}
        className={
          "mr-2 p-2 rounded-md border border:black bg-white flex flex-row cursor-pointer hover:bg-blue-500 hover:text-white " +
          (newTodo.place === location ? "bg-blue-500 text-white" : "")
        }
        onClick={() => setNewTodo({ ...newTodo, place: location })}
      >
        {location}
      </li>
    )
  );

  function renderTodos(showDeleted: boolean): JSX.Element[] {
    let filteredTodos = todos
      .filter((todo) => todo.deleted === showDeleted)
      .sort((a, b) => a.id - b.id);

    return filteredTodos.map((todo: Todo) => (
      <li key={todo.id} className="mb-2 flex flex-row justify-between">
        <button
          className="p-2 mr-2 rounded-md bg-black text-white hover:bg-gray-600 cursor-pointer"
          onClick={() => {
            setTodos((prevState) => {
              return [
                ...prevState.filter((el) => el.id !== todo.id),
                toggleCompleteTodo(todo),
              ];
            });
          }}
        >
          {todo.done ? <RiCheckboxLine /> : <RiCheckboxBlankLine />}
        </button>
        <div
          className={
            "flex-1 " + (todo.done ? "line-through text-gray-700" : "")
          }
        >
          {todo.text}
        </div>
        {todo.place ? (
          <div className="p-2 rounded-md border border:black bg-white flex flex-row">
            {placeLabel(todo.place).icon}
            <div className="hidden md:block md:pl-2">
              {placeLabel(todo.place).text}
            </div>
          </div>
        ) : null}
        <button
          className={
            "ml-2 p-2 rounded-md  text-white " +
            (showDeleted
              ? "bg-green-900 hover:bg-green-700"
              : "bg-red-900 hover:bg-red-700")
          }
          onClick={() =>
            setTodos((prevState) => {
              return [
                ...prevState.filter((el) => el.id !== todo.id),
                toggleDeleteTodo(todo),
              ];
            })
          }
        >
          {todo.deleted ? <FaTrashRestoreAlt /> : <BsTrash />}
        </button>
      </li>
    ));
  }

  return (
    <div className="container mx-auto flex flex-col items-center">
      <header className="my-4 text-3xl">TODOS</header>
      <ul className="w-5/6 md:w-4/5">{renderTodos(false)}</ul>
      <button
        className="p-2 mb-2 rounded-md bg-black text-white hover:bg-gray-600 cursor-pointer"
        onClick={() => setTodos((prevState) => completeAll(prevState))}
      >
        Complete All
      </button>
      <form className="w-5/6 flex flex-col" onSubmit={submitNewTodo}>
        <input
          placeholder="todo text"
          className="p-2 border border-black mb-2"
          value={newTodo.text}
          onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
        />
        <input
          placeholder="todo location (optional)"
          className="p-2 border border-black mb-2"
          value={newTodo.place}
          onChange={(e) =>
            setNewTodo({ ...newTodo, place: e.target.value.toLowerCase() })
          }
        />
        <ul className="mb-2 flex flex-row justify-start">{locationChoices}</ul>
        <input
          id="newTodoSubmit"
          type="submit"
          value="Add Todo"
          className={
            "p-2 mb-2 w-64 mx-auto rounded-md bg-black text-white " +
            (newTodo.text
              ? "hover:bg-gray-600 cursor-pointer"
              : "bg-gray-600 cursor-not-allowed")
          }
        />
      </form>
      <div>
        <button
          className="my-4 p-2 w-44 border-2 border-black rounded-md hover:bg-gray-300"
          onClick={() => setShowDeletedTodos(!showDeletedTodos)}
        >
          {showDeletedTodos ? "Hide " : "Show "} Deleted Todos
        </button>
      </div>
      {showDeletedTodos ? (
        <ul className="w-5/6 md:w-4/5">{renderTodos(true)}</ul>
      ) : null}
    </div>
  );
}

export default App;
