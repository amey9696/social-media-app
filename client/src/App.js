import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Login from './components/screens/Login';
import Register from './components/screens/Register';
import CreatePost from './components/screens/CreatePost';
import NotFound from './components/screens/NotFound';
import UserProfile from './components/screens/UserProfile';
import SubscribesUserPost from './components/screens/SubscribesUserPost';
import { reducer, initialState } from './reducers/userReducer';

export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("insta_clone_user"));
    if (user) {
      dispatch({ type: "USER", payload: user })
      // history.push("/");
    } else {
      history.push("/login");
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/createPost" component={CreatePost} />
      <Route exact path="/profile/:userid" component={UserProfile} />
      <Route exact path="/myFollowerPost" component={SubscribesUserPost} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;