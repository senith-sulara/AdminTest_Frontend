import './App.css';
import Home from "./components/home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Switch,
  withRouter 
} from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <section>

            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>

        </section>
      </Router>
    </div>
  );
}

export default App;
