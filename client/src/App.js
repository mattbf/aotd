import React, {useState, useEffect} from 'react';
import './Styles/App.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import Navbar from './Components/PageComponents/Navbar'
import Home from './Components/Home'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Article from './Components/Articles/Article'
import CreateArticle from './Components/Articles/CreateArticle'
import Profile from './Components/Profile'
import Admin from './Components/Admin/Admin'
import useGlobal from './GlobalState/Store/Store';
import axios from 'axios'
import FeaturesPage from './Components/Features/FeaturesPage'
//axios.defaults.withCredentials = true;



// https://aotd.herokuapp.com


const centerBlock = {
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  maxWidth: '1080px',
  backgroundColor: '#F7F9FD',
  paddingBottom: '8px'
}

const centerBlockBlank = {
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  maxWidth: '1080px',
}


function App() {
  //const isMobile = useMediaQuery({ maxWidth: 767 })
  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/user/auth/`: `${baseUrl}/user/auth/`
  const [globalState, globalActions] = useGlobal();
  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })
  //Call auth api
  //const url = process.env.APP_DOMAIN || 'http://localhost:4000'

  useEffect(() => {

    axios.get(apiUrl, { withCredentials: true, useCredentials: true }) // ${baseUrl}
      .then(response => {
        globalActions.setUser(response.data)
        globalActions.LogInOut(true)
        console.log("Signed in user is:")
        console.log(response.data)
        console.log(response.data._id)
        setFetch({
          isLoading: false,
          isError: false,
          error: null
        })
      })
      .catch(function(error) {
        globalActions.LogInOut(false)
        setFetch({
          isLoading: false,
          isError: true,
          error: error
        })
        console.log(error);
      })
  }, [])

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        globalState.isAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const exampleuserobj = {
  username: "Matthew",
  createdAt: new Date(),
}
  return (

      <Router>
        <div style={centerBlock}>
          <Route path="/" component={Home} exact/>
          <Route path="/author/:username" component={Profile}/>
          <Route path="/article/:title" component={Article}/>
          <PrivateRoute path="/new" component={CreateArticle}/>
          <Route path="/features" component={FeaturesPage}/>
          <Route path="/admin" component={Admin}/>
        </div>
        <div style={centerBlockBlank}>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup}/>
        </div>
      </Router>

  );
}

export default App;
