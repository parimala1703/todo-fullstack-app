import React, { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";

function TodoApp() {
  const [todos, setTodos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTodos();
  }, [filter]);

  // Load Todos Based On Filter
  const loadTodos = () => {
    if (filter === "all") {
      getTodos().then((res) => setTodos(res.data));
    } 
    else if (filter === "completed") {
      getTodos(true).then((res) => setTodos(res.data));
    } 
    else {
      getTodos(false).then((res) => setTodos(res.data));
    }
  };

  // Add Todo
  const handleAdd = () => {
    if (!title.trim()) return;

    createTodo({
      title,
      description,
      completed: false,
    }).then(() => {
      setTitle("");
      setDescription("");
      loadTodos();
    });
  };

  // Toggle Complete
  const handleToggle = (todo) => {
    updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    }).then(loadTodos);
  };

  // Delete Todo
  const handleDelete = (id) => {
    deleteTodo(id).then(loadTodos);
  };

  // Start Editing
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  // Save Edit (Keeps completed state)
  const handleUpdate = (id, oldTodo) => {
    updateTodo(id, {
      title: editTitle,
      description: editDescription,
      completed: oldTodo.completed,
    }).then(() => {
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
      loadTodos();
    });
  };

  return (
    <div style={{ width: "520px", margin: "auto" }}>
      <h2>Todo App</h2>

      {/* Add Section */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      <br />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description"
      />
      <br />
      <button onClick={handleAdd}>Add</button>

      <hr />

      {/* Filter Buttons */}
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("completed")}>
        Completed
      </button>
      <button onClick={() => setFilter("pending")}>
        Pending
      </button>

      <hr />

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>

            {editId === todo.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />
                <input
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                />
                <button
                  onClick={() =>
                    handleUpdate(todo.id, todo)
                  }
                >
                  Save
                </button>
                <button onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Checkbox (Tick) */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                />

                {/* Text */}
                <span
                  style={{
                    marginLeft: "8px",
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  <b>{todo.title}</b> — {todo.description}
                </span>

                <button onClick={() => handleEdit(todo)}>
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(todo.id)}
                >
                  ❌
                </button>
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
