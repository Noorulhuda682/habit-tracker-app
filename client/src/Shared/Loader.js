import React,{useState} from "react";
import loginLogo from "../assets/login.jpg"
import  "../styles/loader.scss";
import { useHistory } from 'react-router-dom';
import {
  Link
} from "react-router-dom";
import axios from "axios";


const  Loader = ({style}) =>  {
  // console.log("style",style);
    return (
        <div className="loader" style={style}></div>
    )
}

export default Loader;
  