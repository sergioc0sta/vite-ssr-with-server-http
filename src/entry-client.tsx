import { hydrateRoot } from "react-dom/client"
import { StrictMode } from 'react'
import './index.css'
import App from "./App"

hydrateRoot(document.getElementById("root")!, 
  <StrictMode>
    <App />
  </StrictMode>,
)

