import React, {useEffect, useState} from 'react'
import Feed from './Feed'
import Navbar from './Navbar'
import Footer from './Footer'
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
import FeatureList from './FeatureList'


function FeaturesPage() {
  const [globalState, globalActions] = useGlobal();
  const user = globalState.user
  const auth = globalState.isAuth
  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/user/auth/`: `${baseUrl}/user/auth/`

  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })
  useEffect(() => {
    if (!user.username) {
      axios.get(apiUrl, { withCredentials: true }) //${baseUrl}
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
        <FeatureList/>
      <Footer/>
    </div>
  )
}

export default FeaturesPage
