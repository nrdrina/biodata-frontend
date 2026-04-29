import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: ""
  });

  const [data, setData] = useState([]);
  // EDIT
  const [editId, setEditId] = useState(null);

  //GET DATA
  const API_URL = "https://biodata-backend-fd42.onrender.com/api/biodata/";

  // READ (GET)
  const fetchData = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FORM INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `${API_URL}${editId}/`
      : API_URL;

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        age: Number(form.age)
      })
    })
    .then(res => res.json())
    .then(() => {
      alert(editId ? "Updated successfully ✏️" : "Saved successfully ✅");

      setForm({ name: "", age: "", email: "" });
      setEditId(null);
      fetchData();
    })
    .catch(err => {
      console.error(err);
      alert("Error ❌");
    });
  };

  // DELETE
  const deleteItem = (id) => {
    fetch(`${API_URL}${id}/`, {
      method: "DELETE"
    })
    .then(() => {
      alert("Deleted!");
      fetchData();
    });
  };


  const handleEdit = (item) => {
    setForm({
      name: item.name,
      age: item.age,
      email: item.email
    });

    setEditId(item.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Biodata CRUD</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input 
          name="name" 
          placeholder="Name" 
          value={form.name}
          onChange={handleChange} 
        />

        <input 
          name="age" 
          placeholder="Age" 
          value={form.age}
          onChange={handleChange} 
        />

        <input 
          name="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange} 
        />
        <button type="submit">Submit</button>
      </form>

      <hr />

      {/*LIST */}
      <h3>Saved Data</h3>

      {data.map(item => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <b>{item.name}</b> ({item.age}) - {item.email}

          <button
            onClick={() => handleEdit(item)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteItem(item.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
