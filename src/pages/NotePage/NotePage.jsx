import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotePage({ user }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch("/api/notes", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    if (text.trim() === "") {
      setError("Note text cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }

      const newNote = await response.json();

      if (!newNote.createdAt) {
        newNote.createdAt = new Date().toISOString();
      }

      setNotes((prevNotes) => [...prevNotes, newNote]);
      setText("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem('token');
    // console.log(id);
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }

      setNotes((prevNotes) => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      setFetchError(error.message);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div>
      <h1>Notes Page For {user.name}</h1>
      <section className="showcase">
        <form id="image-form" onSubmit={add}>
          <label htmlFor="prompt"><h2>Add Note:</h2></label>
          <div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="text"
              placeholder="add note..."
              required
            />
          </div>
          <button type="submit" disabled={loading}>SUBMIT</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <section>
          <h2>Previous Notes:</h2>
          {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
          <button onClick={toggleSortOrder}>
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          {sortedNotes.length > 0 ? (
            <ul>
              {sortedNotes.map((note) => (
                <li key={note._id}>
                  {note.text} - {new Date(note.createdAt).toLocaleString()}
                  <button onClick={() => deleteNote(note._id)}>DELETE</button>
                  <Link to={`/note/${note._id}`}><button>EDIT</button></Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notes yet</p>
          )}
        </section>
      </section>
    </div>
  );
}