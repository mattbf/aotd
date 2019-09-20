import React, {useState} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios'
import useGlobal from '../GlobalState/Store/Store';

import {
  Pane,
  Button,
  Text,
  Heading,
  Avatar,
  TextInput,
  Spinner
} from 'evergreen-ui'

const center = {
  width: '100%',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '25px'
}

function Login(props) {
  const requrl = process.env.APP_DOMAIN || 'http://localhost:4000'
  const [globalState, globalActions] = useGlobal();
  const location = props.location
  const browserHistory = props.history
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const from = props.location.state ? props.location.state.from : { pathname: '/'}
  const home = '/'
  const goBackHome = from.pathanme === home ? true : false
  //console.log(location.pathname)
  // console.log(home)
  // console.log(from.pathname)
  // console.log(goBackHome)

  const updateField = (e) => {
    setLogin({...login, [e.target.name]: e.target.value})
  }
  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null,
    isAuth: false
  })
  function DisplayProps() {
    console.log(props)
  }
  const goBackFunc = props.history.goBack

  function backtoprev() {
    goBackFunc()
  }


  function tryLogin() {
    axios.post(`/user`, { // removed ${requrl} 
      logemail: login.email,
      logpassword: login.password,
      withCredentials: true
    })
        .then(response => {
            globalActions.setUser(response.data)
            console.log("repsonse data ")
            console.log(response)
            console.log(response.data)
            setFetch({
              isLoading: false,
              isError: false,
              error: null,
              isAuth: true
            })
            globalActions.LogInOut(true)

            console.log("logged in")
        })
        .catch(function (error){
            setFetch({
              isLoading: false,
              isError: true,
              error: error,
              isAuth: false
            })
            console.log(error);
        })
  }
  if (fetch.isAuth) {
    browserHistory.push(from.pathname)
  }

  return(
    <div style={center}>
      <Pane padding={15} background="tint1" display="flex" flexDirection="column" alignItems="center">
        <Heading size={500} marginBottom={20} >Sing in to your account</Heading>
        <TextInput
          name="email"
          type="email"
          placeholder="email"
          marginBottom="15px"
          width="100%"
          value={login.email}
          onChange={updateField}
        />
        <TextInput
          name="password"
          type="password"
          placeholder="password"
          marginBottom="15px"
          width="100%"
          value={login.password}
          onChange={updateField}
        />
        <Button
          width='100%'
          appearance="primary"
          style={{display: 'flex', justifyContent: 'center'}}
          onClick={tryLogin}
        >
          {fetch.isLoading ?
            <Spinner size={16} style={{color: '#FFFFFF'}}/>
            :
            "Login"
          }
        </Button>
        {fetch.isError ?
          <div>
            <Text color="#EC4C47" size={300}> {fetch.error.message}</Text>
          </div>
          :
          null
        }
        <Pane flex={1} alignItems="center" display="flex" marginTop={15}>
          <Text size={300}>"Dont' have an account?"</Text>
          <Link to='/signup' style={{marginTop: '-4px', marginLeft: '4px'}}>
            <Text size={300} marginRight={3}>Sign up here</Text>
          </Link>
        </Pane>
      </Pane>
    </div>
  )
}

export default Login
