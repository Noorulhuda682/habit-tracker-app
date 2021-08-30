import React,{useEffect, useState} from "react";
import loginLogo from "../assets/login.jpg"
import  "../styles/login.scss";
import { useHistory } from 'react-router-dom';
import {
  Link
} from "react-router-dom";
import axios from "axios";
import Loader from "../Shared/Loader";
import { auto } from "async";

import Cookies from 'universal-cookie';
const cookies = new Cookies();


const  Login = () =>  {
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [loader,setLoader] = useState(false)
    const [exception,setException] = useState("")
    const [pass,setPass] = useState("")
    const history = useHistory();

    useEffect( () => {
      if(cookies.get('user')) history.push('/dashboard');
    },[])

    const handleSubmit = async (e) => { 
      setPass("");
      setException("");
      e.preventDefault();
      if(userName === ""){ setException("Empty username field"); return true}
      if(password === ""){ setException("Empty password field"); return true}

      setLoader(true)
      await axios.post("https://habit-tracker-ap.herokuapp.com/login",{
         userName,
         password
      })
      .then( res => {
        console.log("res",res);
        setLoader(false)
        if(res.data.status === "failed"){ setException(res.data.message)
        return false
        }
        setPass("Login Succesfull")
        cookies.set('user',res.data.data, { path: '/' });
        history.push('/');
      }).catch( error => {
        setLoader(false)
       console.log("Err||",error)
       setException(error)
      })
    }

    


    return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
         <img src={loginLogo}/>  
        
         {loader &&
          <div style={{margin:'0 auto',marginBottom:'20px'}}>
          <Loader/>
         </div>
         }

         {exception && 
         <div className="alert fail">
           <p>{exception}</p>
         </div>
         }

        {pass && 
         <div className="alert pas">
           <p>{pass}</p>
         </div>
         }

         <input className="username" placeholder="username" type="text" id="fname" name="fname"
          onChange={(event) => {setUserName(event.target.value); console.log(userName);}}
          value={userName}
          />
         <input className="username" placeholder="password" type="text" id="fname" name="fname"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          />
         <input className="username" type="submit" value="login"/>
         <p>
          <Link className="link" to="/signup">SignUp</Link>
         </p>
         
      </form> 
    </div>
    )
}

export default Login;
  