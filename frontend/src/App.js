import './App.css';
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom'
import AllRoutes from './Files/Components/AllRoutes/AllRoutes';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

function App() {
  return (
    <>
      <BrowserRouter>
        <AllRoutes/>
        <Toaster position="top-right" />
      </BrowserRouter>
    </>
  );
}

export default App;
