import React, {useEffect, useState} from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios'
import useGlobal from '../GlobalState/Store/Store';
import MediaQuery from 'react-responsive';
import useWindowSize from '../Utils/useWindowSize'
import GithubIcon from '../GitHub-Mark-64px.png'
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
  IconButton,
  Badge
} from 'evergreen-ui'

const logoBlock = {
  display: 'flex',
  flexDirection: 'row',
}

const darkText = {
  color: '#234361',
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

const aLink = {
  textDecoration: 'none',
  textColor: '#234361',
  '&:hover': {
    textColor: '#4388EF',
    textDecoration: 'underline',
  }
}
const footerIcon = {
  textDecoration: 'none',
  color: '#234361',
  opacity: 0.5,
  width: "20px",
  '&:hover': {
    textColor: '#4388EF',
    opacity: 1,
  }
}

function Footer(props) {
  const windowSize = useWindowSize()
  const isMobile = windowSize.width < 700 ? true : false

  const { match, location, history } = props
  const path = match.path
  const isArticle = path == 'http://localhost:4000/article/:title' ? true : false

  const browserHistory = props.history

  return (
    <div>
      <Pane display="flex" padding={16} background="#EBEDF0" borderRadius={3}>
        <Pane flex={1} alignItems="center" display="flex" justifyContent="center" flexDirection="column">
          <div style={{alignItems:"center", display:"flex",justifyContent:"center",flexDirection:"row", marginBottom: '25px'}}>
            <Link to='/features' style={{marginRight: '12px', margin: '0px', textDecoration: 'none', display:"flex",justifyContent:"center",flexDirection:"row",}}>
              <Badge color="blue" isSolid marginRight={8}>New!</Badge>
              <Heading size={200} style={darkText}>Email notifications will now be sent when new articles are posted!</Heading>
            </Link>
          </div>
          <Heading size={200} style={darkText}>Built by <a style={aLink} href={"mailto:matthewbf8@gmail.com"}>Matthew Behan-Fossey</a></Heading>
          <div style={{alignItems:"center", display:"flex",justifyContent:"center",flexDirection:"row", marginTop: '10px'}}>
            <a href={"https://github.com/mattbf/aotd"} target="_blank">
              <img style={footerIcon} className="img-responsive" src={GithubIcon} alt="aotdgithublink"/>
            </a>
          </div>
        </Pane>
        <Pane>
        </Pane>
      </Pane>
    </div>
  );
}

export default withRouter(Footer)
