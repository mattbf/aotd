import React from 'react';
import { Link, withRouter } from "react-router-dom";
import useGlobal from '../GlobalState/Store/Store';
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
  Spinner
} from 'evergreen-ui'

const logoBlock = {
  display: 'flex',
  flexDirection: 'row',
}

const lightText = {
  color: '#FFFFFF'
}

const menuText = {
  textDecoration: 'none',
  color: '#000000',
  textColor: '#000000',
  '&:visited': {
    textColor: '#000000',
  }
}

function Navbar(props) {
  const [globalState, globalActions] = useGlobal();
  const user = globalState.user
  const auth = globalState.isAuth
  const PublishArticle = props.publish
  const { match, location, history } = props
  const path = match.path
  const isArticle = path == '/article/:title' ? true : false
  
  return (
    <div>
      <Pane display="flex" padding={16} background="#234361" borderRadius={3}>
        <Pane flex={1} alignItems="center" display="flex">
          <Button is={Link} to="/" intent="danger" height={32} marginRight={16} iconBefore="cross">
            Cancel
          </Button>
        </Pane>
        <Pane>
          <Button disabled={!props.canPost} onClick={PublishArticle} appearance="primary">Publish Article</Button>
        </Pane>
      </Pane>
    </div>
  );
}

export default withRouter(Navbar)
