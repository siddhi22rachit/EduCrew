import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/landingPage/LandingPage"

export default function App() {
  return (
    <>
      <BrowserRouter>
         <Routes>
              <Route path="/" element={<LandingPage />} />
         </Routes>
      </BrowserRouter>
    </>
  )
}