import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Movie from "./components/Movie";
import Header from "./components/Header";
import Tv from "./components/Tv";
import MovieDetail from "./components/MovieDetail";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route exact path="/detail/:id">
          <MovieDetail />
        </Route>
        <Route exact path="/">
          <Movie />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
