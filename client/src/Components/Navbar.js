import React, {useEffect, useState} from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios'
import useGlobal from '../GlobalState/Store/Store';
import MediaQuery from 'react-responsive';
import useWindowSize from '../Utils/useWindowSize'
import {
  Pane,
  Button,
  Text,
  Heading,
  Avatar,
  BackButton,
  Menu,
  Popover,
  toaster,
  Position,
  Box,
  IconButton
} from 'evergreen-ui'

const logoBlock = {
  display: 'flex',
  flexDirection: 'row',
}

const lightText = {
  color: '#FFFFFF',
  margin: '0px'
}

const menuText = {
  textDecoration: 'none',
  color: '#000000',
  textColor: '#000000',
  '&:visited': {
    textColor: '#000000',
  }
}
//className="logoBlock"

function UserMenu(props) {
  // const [globalState, globalActions] = useGlobal();
  // const user = globalState.user
  // const auth = globalState.isAuth
  // const [user, setUser] = useState({
  //   username: "username",
  // })
  const [authorLink, setAuthorLink] = useState('/')
  useEffect(() => {
    setAuthorLink(`/author/${user.username}`)
  }, [])

  const user = props.user
  // const authorLink = `/author/${user.username}`
  //console.log(user)
  const LogoutUser = props.logout
  return(
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Link to={authorLink} style={menuText}>
              <Menu.Item>
                Profile
              </Menu.Item>
            </Link>
            <Menu.Item
              onSelect={LogoutUser}
              //secondaryText=">"
              style={menuText}
            >
              Logout
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Button marginRight={props.isMobile ? 5 : 16} appearance="minimal" style={{border: 'none'}}>
        <Pane display="flex" alignItems="center">
          <Avatar name={user.username} size={30} marginRight={5} hashValue="id_124" />
          {props.isMobile ?
            null
            :
            <Text size={400} style={lightText}> {user.username} </Text>
          }
        </Pane>
      </Button>
    </Popover>
  )
}

// <Pane display="flex" alignItems="center">
//   <Avatar name="Jeroen Ransijn" size={30} marginRight={5} hashValue="id_124" />
//   <Text size={400} style={lightText}> User name </Text>
// </Pane>

function Navbar(props) {
  const [globalState, globalActions] = useGlobal();
  const auth = globalState.isAuth
  const user = globalState.user
  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/user/logout/`: `${baseUrl}/user/logout/`

  const windowSize = useWindowSize()
  const isMobile = windowSize.width < 700 ? true : false

  const { match, location, history } = props
  const path = match.path
  const isArticle = path == 'http://localhost:4000/article/:title' ? true : false
  const isFeatures = path == 'http://localhost:4000/features' ? true : false

  const browserHistory = props.history
  function LogoutUser() {
    axios.get(apiUrl)
        .then(response => {
          //console.log("user logged out")
          globalActions.LogInOut(false)
           history.push('/')
        })
        .catch(function (error){
            console.log(error);
        })
  }

  // useEffect(() => {
  //   if (!user.username) {
  //     axios.get(`${baseUrl}/user/auth/`, { withCredentials: true })
  //       .then(response => {
  //         //setUser(response.data);
  //         globalActions.setUser(response.data)//check this
  //         globalActions.LogInOut(true)
  //         //console.log(response
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       })
  //   }
  // }, [])
  return (
    <div>
      <Pane display="flex" padding={16} background="#234361" borderRadius={3}>
        <Pane flex={1} alignItems="center" display="flex">
        { isArticle ?
          <BackButton is={Link} to="/"/>
          :
          <Pane flex={1} alignItems="center" display="flex">
            <div>
              <Link to='/' style={{marginRight: '12px', margin: '0px', textDecoration: 'none'}}>
                <Heading size={700} style={lightText}>AOTD</Heading>
                {isMobile ?
                  <Heading size={200} style={lightText}></Heading>
                  :
                  <Heading size={200} style={lightText}>Article Of The Day</Heading>
                }
              </Link>
            </div>
          </Pane>
        }
        </Pane>
        <Pane>

           {auth ?
             <div style={{display: 'flex'}}>
              {isMobile ?
              <Button is={Link} style={{color: "#FFFFFF", textColor: "#FFFFFF"}} icon="plus" to="/new" appearance="primary">New</Button>
              :
              <Button is={Link} iconBefore="plus" to="/new" appearance="primary">New Article</Button>}
              <UserMenu user={user} logout={LogoutUser} isMobile={isMobile}/>
              </div>
            :
            <div>
              <Button style={{color: '#FFFFFF'}} is={Link} to="/login" appearance="minimal" marginRight="10px">Login</Button>
              <Button is={Link} to="/signup" appearance="primary">Sign Up</Button>
            </div>
          }
        </Pane>
      </Pane>
    </div>
  );
}

export default withRouter(Navbar)


//Add links to nav with
// <Link to='/' style={{marginRight: '6px', marginLeft: '6px', textDecoration: 'none'}}>
//   <Text size={300} style={lightText}>Articles</Text>
// </Link>
