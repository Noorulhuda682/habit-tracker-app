import React, { useState, useRef, useEffect } from "react";
import useGoogleSpreadsheet from 'use-google-spreadsheet';
import rocketLogo from "../assets/rocket-icon.png";
import "../styles/dashboard.scss";
import Cookies from "universal-cookie";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Loader from "../Shared/Loader";
// import useGoogleSheets from 'use-google-sheets';
import { GoogleSpreadsheet } from "google-spreadsheet";

const cookies = new Cookies();

// Config variables
const SPREADSHEET_ID = "1Eu_PnXso4qLmGO5z-9diFTaOxdo17vea3YKgk8SwNQM";
// const SHEET_ID = "MaryBeth 👁";
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY

const dateTimeGenerater = () => {
  let a = new Date();
  let weekdays = new Array(7);
  weekdays[0] = "Sun";
  weekdays[1] = "Mon";
  weekdays[2] = "Tue";
  weekdays[3] = "Wed";
  weekdays[4] = "Thu";
  weekdays[5] = "Fri";
  weekdays[6] = "Sat";
  let month = new Array(12);
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";
  let d = weekdays[a.getDay()];
  let m = month[a.getMonth()];
  let date = a.getDate();
  // console.log("d+m", d + ", " + m + " " + date);
  return `${d}, ${m} ${date}`;
};
let SHEET_URL =  "https://docs.google.com/spreadsheets/d/1Eu_PnXso4qLmGO5z-9diFTaOxdo17vea3YKgk8SwNQM/edit?usp=sharing"
// let API_KEY = process.env.API_KEY
const Dashboard = () => {
  const [userName, setUserName] = useState(cookies.get("user")?.userName  );
  const [habits, setHabits] = useState([]);
  const [currentTime, setCurrentTime] = useState(dateTimeGenerater());
  const [activeHabit, setActiveHabit] = useState(null);
  const [score, setScore] = useState();
  const [miwHandler, setMiwHandler] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [loader, setLoader] = useState(null);
  const [nextPrevious, setNextPrevious] = useState({ min: 0, max: 5 });
  const history = useHistory();
  
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const appendSpreadsheet = async () => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();
  
      const sheet1 = doc.sheetsByTitle[userName];
      
      // const result = await sheet.addRow(row);
      console.log("row",userName);
      sheet1.getRows()
      .then( res => { 
        // console.log("res===",res); 
        setHabits(res)
        let totalsRow = res.find(row => row.Habit === 'TOTAL');
        setScore(totalsRow[currentTime])
       })
      .catch(err => console.log("err",err))
      console.log(doc.title);
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  
  const updateData = async (rowNumber, prevValue, isMiw) => {
    habits[rowNumber][currentTime] = isMiw  ?  ( prevValue === "0" ? minutes : "0")
      : ( prevValue > "0" ? "0" : "100" )
      
      await habits[rowNumber].save()
      appendSpreadsheet()
      setActiveHabit("");
  };



  let miwRowNumber = useRef();
  let miwPreviousValue = useRef();

  let intervalId = useRef();
  const stateRef = useRef();

  

  

  useEffect(() => {
    console.log("USER===>", cookies.get("user"));
    if (!cookies.get("user")) {
      history.push("/login");
      return false;
    }
    appendSpreadsheet()
  }, []);


  let { min, max } = nextPrevious;
  return (
    <div className="dashboard-container">
      <header>
        Team Survyer Habit Tracker <img src={rocketLogo} />
      </header>

      {!miwHandler ? (
        <div className="dashboard-body">
          <p className="buttons btn-parent">
            <button
              className="prev log"
              onClick={() => {
                cookies.remove("user");
                history.push("/login");
              }}
            >
              logout
            </button>
          </p>

          {!habits.length && <Loader style={{ margin: "0 auto" }} />}
          <div className="cards-container">
            {habits.map((habit, index) => {

              return (habit.Habit || habit.Target) &&
              index >= min &&
              index <= max &&
              habit.Habit !== "TOTAL" ? (
                <div
                  onClick={() => {
                    setActiveHabit(habit.Habit);
                    setLoader(habit.Habit);
                    console.log("");
                    if (
                      habit.Habit === "MIW Minutes" &&
                      habit[currentTime] !== "0"
                    ) {
                      // console.log("me",habit[currentTime]);
                      updateData(index, habit[currentTime]);
                      return true;
                    }
                    if (
                      habit.Habit === "MIW Minutes" &&
                      habit[currentTime] == "0"
                    ) {
                      setMiwHandler(true);
                      miwRowNumber.current = index;
                      miwPreviousValue.current = habit[currentTime];
                    } else {
                      updateData(index, habit[currentTime]);
                      // setLoader(habit.Habit)
                    }
                  }}
                  className={`card
                ${habit[currentTime] == "100" && habit.Habit !== "MIW Minutes"  && "card-green"}
                ${activeHabit == habit.Habit && "bor"}
                ${
                  habit.Habit == "MIW Minutes" &&
                  habit[currentTime] < 100 && habit[currentTime] > 0  &&
                  "card-yellow"
                } 
                ${
                  habit.Habit === "MIW Minutes" && habit[currentTime] > 99 && "card-green"
                } 
                `}
                  key={index}
                >
                  <p className="title">{habit.Habit}</p>
                  <p className="text">{habit.Target}</p>
                </div>
              ) : null
            }
            )}
          </div>
          <p className="buttons">
            <button
              className="prev"
              onClick={() =>
                min !== 0 && setNextPrevious({ min: min - 6, max: max - 6 })
              }
            >
              Previous
            </button>
            <button
              className="prev next"
              onClick={() => setNextPrevious({ min: min + 6, max: max + 6 })}
            >
              Next
            </button>
          </p>
          <h1 className="score">Today's Score : {score} </h1>
          {/* Current Time : {currentTime} */}
          <p className="link1" style={{ marginBottom: "-10px" }}>
            <a href="https://docs.google.com/spreadsheets/d/1Eu_PnXso4qLmGO5z-9diFTaOxdo17vea3YKgk8SwNQM/edit#gid=805807478">
              Link to google sheet
            </a>
          </p>
          <p className="link2">
            <a href="https://docs.google.com/spreadsheets/d/1Eu_PnXso4qLmGO5z-9diFTaOxdo17vea3YKgk8SwNQM/edit#gid=805807478">Link to rules (google doc)</a>
          </p>
        </div>
      ) : (
        <div className="miw-dashboard">
          <h1>MIW</h1>
          <div>
            <input
              onChange={(e) => setMinutes(e.target.value)}
              value={minutes}
            />
          </div>

          <p> number of minutes</p>
          <button
            onClick={() => {
              setMiwHandler(false);
              updateData(miwRowNumber.current, miwPreviousValue.current, true);
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// ${ habit.Habit === activeHabit && "card-green"}
