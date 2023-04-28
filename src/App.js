import "./App.css";
import Home from "./components/home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Switch,
  withRouter,
} from "react-router-dom";
import AddProducts from "./components/addProducts";
import UpdateProducts from "./components/updateProduct";
import ViewProducts from "./components/productDetails";
import Login from "./components/login";
import NavBar from "./components/navBar/navbar";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <section>
          {/* {localStorage.getItem("TOKEN") ? ( */}
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/addproduct" element={<AddProducts />} />
              <Route path="/updateproduct/:id" element={<UpdateProducts />} />
              <Route path="/viewproduct/:id" element={<ViewProducts />} />
              <Route path="/" element={<Login />} />
            </Routes>
         {/* ) : (
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          )}  */}
        </section>
      </Router>
    </div>
  );
}

export default App;
