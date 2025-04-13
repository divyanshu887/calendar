import React from 'react';
import CalendarApp from './Components/CalendarApp';
import './index.css'
import { SocketProvider } from "./Context/SocketContext";


const App = () => {
  return (
    <div className="container">
     <SocketProvider>
        <CalendarApp />
      </SocketProvider>
    </div>
  );
};

export default App;
