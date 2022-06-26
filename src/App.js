import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import HeaderComponent from "./Components/Header/HeaderComponent";

function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />;
      <Footer />
    </BrowserRouter>
  );
}

export default App;
