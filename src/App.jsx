import { useState } from 'react'
import './App.css'
import { Button } from "./components/ui/button.jsx"
import Sample from './components/custom/Sample.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/*sample*/}
      <Sample/>
    </>
  )
}

export default App
