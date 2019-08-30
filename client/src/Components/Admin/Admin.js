import React, {useEffect, useState} from 'react'
import UserTable from './UserTable'
import ArticleTable from './ArticleTable'
import {
  Heading,
} from 'evergreen-ui'
import axios from 'axios'

const AdminWrapper = {
  display: 'flex',
  flexDirection: 'column'
}
const Content = {
  display: 'flex',
  flexDirection: 'column'
}

function Admin() {
  const [userData, setUserData] = useState([])
  const [allArticles, setAllArticles] = useState([])
  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })

  useEffect(() => {
    axios.get('localhost:4000/admin/', {withCredentials: true})
      .then(response => {
        // setUserData(response.data.users);
        // setAllArticles(response.data.articles);
        console.log(response)
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
  }, [])

  return(
    <div style={AdminWrapper}>
      <div style={Content}>
        {fetch.isLoading ?
          <div> Loading </div>
          :
          fetch.isError ?
          <div> Error: {fetch.error.message} </div>
          :
          userData.length == 0 || null ?
          <div> No Users </div>
          :
          <div>
            <Heading> Users </Heading>
            <UserTable users={userData}/>
          </div>
        }
      </div>
      <div style={Content}>
      {fetch.isLoading ?
        <div> Loading </div>
        :
        fetch.isError ?
        <div> Error: {fetch.error.message} </div>
        :
        allArticles.length == 0 || null ?
        <div> No Articles </div>
        :
          <div>
            <Heading> Articles </Heading>
            <ArticleTable articles={allArticles}/>
          </div>
      }
      </div>
    </div>
  )
}

export default Admin
