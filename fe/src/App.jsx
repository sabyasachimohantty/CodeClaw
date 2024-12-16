import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Problem from "./components/Problem"
import { BrowserRouter, Route, Routes } from 'react-router'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem/:title" element={<Problem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
