import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    console.log('✅ App hydrated successfully')
  }, [])

  const increment = () => {
    setCount(count + 1)
    console.log(`🔢 Counter incremented to: ${count + 1}`)
  }

  const decrement = () => {
    setCount(count - 1)
    console.log(`🔢 Counter decremented to: ${count - 1}`)
  }

  const reset = () => {
    setCount(0)
    console.log('🔄 Counter reset')
  }

  return (
    <div className="app">
      <h1>SSR with Vite + TypeScript</h1>
      <p>This page was server-side rendered with CSS!</p>
      
      <div className="counter-section">
        <h2>React Counter</h2>
        <div className="counter-display">
          <span className="counter-value">{count}</span>
        </div>
        
        <div className="counter-buttons">
          <button onClick={decrement} className="btn btn-secondary">
            -1
          </button>
          <button onClick={reset} className="btn btn-warning">
            Reset
          </button>
          <button onClick={increment} className="btn btn-primary">
            +1
          </button>
        </div>
      </div>

      <div className="status">
        <p>Status: {isHydrated ? 'Hydrated ✅' : 'Waiting for hydration ⏳'}</p>
        <p>If buttons work, hydration is perfect!</p>
      </div>
    </div>
  )
}

export default App
