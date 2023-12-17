import { useState } from "react";
import "./App.css";

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

function App() {
  const [authInfo, setAuthInfo] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

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

  const registerCredential = async () => {
    const resp = await fetch("/api/webauthn/register-options", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    let attResp;
    try {
      const opts = await resp.json();
      console.log(JSON.stringify(opts, null, 2));

      attResp = await startRegistration(opts);
      console.log(JSON.stringify(attResp, null, 2));
    } catch (error) {
      const _error = error as Error;
      console.error(_error);
      setMessage(_error.message);
      throw _error;
    }

    const verificationResp = await fetch("/api/webauthn/credential", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attResp),
    });

    const verificationJSON = await verificationResp.json();
    console.log(JSON.stringify(verificationJSON, null, 2));

    if (verificationJSON && verificationJSON.verified) {
      setMessage(`Authenticator registered!`);
    } else {
      setMessage(
        `Oh no, something went wrong! Response: 
        <pre>
        ${JSON.stringify(verificationJSON)}
        </pre>`
      );
    }
  };

  const authenticate = async () => {
    const resp = await fetch("/api/webauthn/authentication-options");

    let asseResp;
    try {
      const opts = await resp.json();
      console.log(JSON.stringify(opts, null, 2));

      asseResp = await startAuthentication(opts);
      console.log(JSON.stringify(asseResp, null, 2));
    } catch (error) {
      const _error = error as Error;
      console.error(_error);
      setMessage(_error.message);
      throw _error;
    }

    const verificationResp = await fetch("/api/webauthn/authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asseResp),
    });

    const verificationJSON = await verificationResp.json();
    console.log(JSON.stringify(verificationJSON, null, 2));

    if (verificationJSON && verificationJSON.verified) {
      setMessage(`User authenticated!`);
    } else {
      setMessage(
        `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verificationJSON
        )}</pre>`
      );
    }
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
      <button
        type="button"
        className="primary"
        style={{ marginRight: "20px" }}
        onClick={() => registerCredential()}
      >
        Register Device
      </button>
      <button
        type="button"
        className="secondary"
        onClick={() => authenticate()}
      >
        Two Factor Authentication
      </button>
      <h3>{message}</h3>
    </>
  );
}

export default App;
