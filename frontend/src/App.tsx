import { Navbar } from './components/Navbar';
import './App.css'
import '@coinbase/onchainkit/styles.css';
import { BrowserRouter, Routes, Route } from "react-router";
import { Hunts } from "./components/Hunts";
import { Clue } from "./components/Clue";
import { Rewards } from "./components/Rewards";
import { HuntEnd } from "./components/HuntEnd";
import { Footer } from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-yellow/10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hunts />} />
          <Route path="/hunt/:huntId/clue/:clueId" element={<Clue />} />
          <Route path="/hunt/:huntId/end" element={<HuntEnd />} />
          <Route path="/profile" element={<Rewards />} />
        </Routes>
        <div className="md:hidden">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
