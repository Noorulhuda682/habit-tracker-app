import React, { useState } from "react";
import loginLogo from "../assets/login.jpg";
import "../styles/login.scss";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../Shared/Loader";

import Cookies from 'universal-cookie';
const cookies = new Cookies();

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [exception, setException] = useState("");
  const [pass, setPass] = useState("");
  const history = useHistory();

  // history.push('/dashboard');
  const handleSubmit = async (e) => {
    setPass("");
    setException("");
    e.preventDefault();
    if (userName === "") {
      setException("Empty username field");
      return true;
    }
    if (email === "") {
      setException("Empty email field");
      return true;
    }
    if (password === "") {
      setException("Empty password field");
      return true;
    }
    setLoader(true);
    await axios
      .post("https://habit-tracker-ap.herokuapp.com/signup", {
        userName,
        email,
        password,
      })
      .then((res) => {
        console.log("res", res);
        setLoader(false);
        if (res.data.status === "success") {
               setPass(res.data.message);
               axios.post("https://habit-tracker-ap.herokuapp.com/login", {
                  userName,
                  password,
                })
                .then((res2) => {
                  console.log("res", res2);
                  cookies.set("user", res2.data.data, { path: "/" });
                  history.push("/"); 
                })
                .catch((error) => {
                  setLoader(false);
                  console.log("Err||", error);
                  setException(error);
                });
            return true
        }
        setException(res.data.message);
        setLoader(false);

        // history.push('/dashboard');
      })
      .catch((error) => {
        console.log("Err==>", error);
        setException(error.toString());
        setLoader(false);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={loginLogo} />

        {loader && (
          <div style={{ margin: "0 auto", marginBottom: "20px" }}>
            <Loader />
          </div>
        )}

        {exception && (
          <div className="alert fail">
            <p>{exception}</p>
          </div>
        )}

        {pass && (
          <div className="alert pas">
            <p>{pass}</p>
          </div>
        )}

        <input
          className="username"
          placeholder="username"
          type="text"
          id="fname"
          name="fname"
          onChange={(event) => {
            setUserName(event.target.value);
            console.log(userName);
          }}
          value={userName}
        />
        <input
          className="username"
          placeholder="email"
          type="email"
          id="fname"
          name="fname"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          className="username"
          placeholder="password"
          type="password"
          id="fname"
          name="fname"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <input className="username" type="submit" value="SignUp" />
        <p >
          <Link className="link" to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
