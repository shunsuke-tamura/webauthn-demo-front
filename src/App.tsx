import { useState } from "react";
import "./App.css";

function App() {
  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
  });

  const signUp = () => {
    fetch("/api/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authInfo),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const signIn = () => {
    fetch("/api/auth/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authInfo),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <div>
            <p>email</p>
            <input
              type="text"
              value={authInfo.email}
              onChange={(e) =>
                setAuthInfo((prev) => {
                  return { ...prev, email: e.target.value };
                })
              }
            />
          </div>
          <div>
            <p>password</p>
            <input
              type="text"
              value={authInfo.password}
              onChange={(e) =>
                setAuthInfo((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            />
          </div>
        </div>
        <br />
        <button
          type="button"
          className="primary"
          style={{ marginRight: "20px" }}
          onClick={signUp}
        >
          SignUp
        </button>
        <button type="button" className="secondary" onClick={signIn}>
          SignIn
        </button>
      </div>
      <br />
      <button type="button" className="primary" style={{ marginRight: "20px" }}>
        Register Device
      </button>
      <button type="button" className="secondary">
        Two Factor Authentication
      </button>
    </>
  );
}

export default App;
