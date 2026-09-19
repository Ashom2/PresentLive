import { useState } from 'react'







const initialTodos = [
  { task: "Take out the trash", completed: false },
  { task: "Walk the dog", completed: true },
  { task: "Do the weekly quizzes", completed: false },
];

function Todo({ task, completed, onToggle }) {
  return (
    <section>
      <input type="checkbox" checked={completed} onChange={onToggle} />
      <p style={{ display: "inline-block", marginLeft: "0.5rem" }}>
        {task}
      </p>
    </section>
  );
}

function NewTodoForm({ onAdd }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ task: trimmed, completed: false });
    setText("");
  }

  return (
    <form onSubmit={submit} style={{ margin: "1rem 0" }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task…"
      />
      <button type="submit" style={{ marginLeft: "0.5rem" }}>
        Add
      </button>
    </form>
  );
}

export default function App() {
  const [todos, setTodos] = useState(initialTodos);

  function toggleCompleted(task) {
    setTodos((prev) =>
      prev.map((t) =>
        t.task === task ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function addTodo(todo) {
    setTodos((prev) => [...prev, todo]); // append to end
  }
  
  return (
    <>
      <header>
        <h1>Todo App</h1>
      </header>

      <main>
        <h2>List of Todos</h2>
        <NewTodoForm onAdd={addTodo} />
        {todos.map((todo) => (
          <Todo 
            key={todo.task} 
            {...todo}
            onToggle={() => toggleCompleted(todo.task)}
          />
        ))}
      </main>
    </>
  );
}


/*
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/
