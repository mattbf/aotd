import React from 'react';
import { Link } from "react-router-dom";
import { HashLink as SectionLink } from 'react-router-hash-link';
import Navbar from './PageComponents/Navbar'

import {
  Pane,
  Button,
  Text,
  Heading,
  Avatar,
  TextInput,

} from 'evergreen-ui'

const Statbox ={
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  backgroundColor: '#FFFFFF',
  borderRadius: '3px',
  width: '100px',
  height: '100px',
  border: 'solid',
  borderWidth: '0.5px',
  borderColor: '#dde8ff',
  marginRight: '10px',

}
const StaboxBar = {
  backgroundColor: '#eef3ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '25%',
  border: 'solid',
  borderColor: '#dde8ff',
  borderWidth: '0.5px',
  borderRadius: '0px 0px 3px 3px'
}
const stat = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '75%'
}

function StatBox(props) {
  return(
    <div style={Statbox}>
      <div style={stat}>
        <Heading size={700}>{props.value}</Heading>
      </div>
      <div style={StaboxBar}>
        <Heading size={300}>{props.label}</Heading>
      </div>
    </div>
  )
}

export default StatBox
