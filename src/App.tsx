import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Movie from "./components/Movie";
import Header from "./components/Header";
import Tv from "./components/Tv";


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route exact path={["/","/detail/:id"]}>
          <Movie />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
