import { useState } from 'react'

import Navbar from './Navbar'
import Home from './Home'
import Login from './Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <Login/>
    </>
  )
}

export default App
