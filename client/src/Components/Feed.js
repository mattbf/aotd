import React, {useEffect, useState} from 'react'
import ArticleBlock from './ArticleBlock'
import axios from 'axios'
import {
  Heading,
  Pane,
  Spinner
} from 'evergreen-ui'


function Feed() {
  const url = process.env.APP_DOMAIN || 'http://localhost:4000'
  const [feed, setFeed] = useState([])
  const articleCount = feed.length
  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })

  useEffect(() => {
    setFetch({
      isLoading: true,
      isError: false,
      error: null
    })
    axios.get(`/articles`) // removed  ${url}
        .then(response => {
            setFeed(response.data);
            setFetch({
              isLoading: false,
              isError: false,
              error: null
            })
        })
        .catch(function (error){
            setFetch({
              isLoading: false,
              isError: true,
              error: error
            })
            console.log(error);
        })
  }, [])

  return (
    <div>
      {fetch.isLoading ?
        <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
          <Spinner />
        </Pane>
        :
        fetch.isError ?
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', minHeight: '400px'}}>
            <Heading marginBottom={10} size={700}>Looks like Something went wrong!</Heading>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
              <Heading size={500}>
              {fetch.error.message}.. Try refreshing the page
              </Heading>
            </div>
          </div>
          :
          <div>
            {feed.slice(0).reverse().map((article, index) =>
              <ArticleBlock key={article._id} article={article} index={index + 1} number={articleCount - index}/>
            )}
          </div>
      }


    </div>
  )
}

export default Feed

//{articleCount < 1 ? <div> No Articles yet... </div> : null}
