import React, {useEffect, useState} from 'react'
import Feed from './Feed'
import Navbar from './Navbar'
import { Link } from "react-router-dom";
import axios from 'axios'
import useGlobal from '../GlobalState/Store/Store';
import {
  Pane,
  Button,
  Text,
  Heading,
} from 'evergreen-ui'
//import { useSimpleState } from 'use-simple-state';
//import { logIn } from '../Store';

//axios.defaults.crossdomain = true;
import MetaTags from 'react-meta-tags';
import MetaImg from '../AOTD-metaimage.png'


function Home() {
  const [globalState, globalActions] = useGlobal();
  const user = globalState.user
  const auth = globalState.isAuth
  const baseUrl = process.env.NODE_ENV == "production" ? null : 'http://localhost:4000'

  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })
  useEffect(() => {
    if (!user.username) {
      axios.get(`${baseUrl}/user/auth/`, { withCredentials: true })
        .then(response => {
          //setUser(response.data);
          globalActions.setUser(response.data)//check this
          globalActions.LogInOut(true)
          //console.log(response)
          setFetch({
            isLoading: false,
            isError: false,
            error: null
          })
        })
        .catch(function(error) {
          setFetch({
            isLoading: false,
            isError: true,
            error: error
          })
          console.log(error);
        })
    }
  }, [])

  return(
    <div>
      <MetaTags>
        <title>Article of the Day</title>
        <meta name="description" content="Article of the day - Where curious minds discuss" />
        <meta property="og:image" content={MetaImg} />
      </MetaTags>
      <Navbar user={user} auth={auth}/>
      <Feed/>
    </div>
  )
}

export default Home

// <Pane flex={1} alignItems="center" display="flex">
//   <Link to='/login' style={{marginTop: '-2px'}}>
//     <Text size={500} marginRight={3}>Login</Text>
//   </Link>
//   <Text size={500}>to view articles</Text>
// </Pane>

// {
//     method: 'GET',
//     url: 'http://localhost:4000/user/auth/',
//     withCredentials: true,
//     crossdomain: true,
//   })
