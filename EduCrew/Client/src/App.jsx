import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingPage/LandingPage"
import Dashboard from "./pages/dashboard/landingPage"

export default function App() {
  return (
    <>
      <BrowserRouter>
         <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard/>} />

         </Routes>
      </BrowserRouter>
    </>
  )
}