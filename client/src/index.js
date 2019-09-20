import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './App';
import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.useCredentials = true;

ReactDOM.render(<App />, document.getElementById('root'));
