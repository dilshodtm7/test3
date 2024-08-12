"use client";
import WebApp from "@twa-dev/sdk";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./body/home.jsx";
import Footer from "./footer/footer.jsx";
import Wallet from "./components/wallet/wallet.jsx";
import Setting from "./components/settings/settings.jsx";
import Task from "./components/missions/task.jsx";
import Invite from "./components/invite/invite.jsx";

import "./App.css";

function App() {
  const getMyAccount = "http://localhost:9090/auth/login";
  // const myId = WebApp.initDataUnsafe.user.id
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getalltasks, setGetalltasks] = useState(null);
  const [tournament, setTournament] = useState(null);

  

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user);
   }
  }, []);


  



  const fetchAccountData = async () => {
    try {
      const response = await fetch(getMyAccount, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_tg: toString(userData.id),
        }),
      });

      if (response.ok) {
        console.log("Account data fetched successfully");
        const data = await response.json();
        console.log(data);
      
        setTournament(data.tournament);
        setData(data.retrieve);
        setGetalltasks(data);
        setLoading(true);
      } else {
        console.error("Failed to fetch account data");
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  console.log(data);
  


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Body
             userData={userData}
              data={data}
              loading={loading}
              fetchAccountData={fetchAccountData}
              tournament={tournament}
            />
          }
        />
        <Route path="/airdrop" element={<Wallet data={data}  loading={loading} />} />
        <Route path="/bonus" element={<Setting data={data} loading={loading} userData={userData} fetchAccountData={fetchAccountData} />} />
        <Route
          path="/task"
          element={
            <Task
              data={getalltasks}
              userData={userData}
              fetchTasks={fetchAccountData}
              loading={loading}
            />
          }
        />
        <Route path="/invite" element={<Invite />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

