import React, {useEffect, useState} from 'react'
import ArticleBlock from './ArticleBlock'
import axios from 'axios'
import {
  Heading,
  Pane,
  Spinner,
  Button
} from 'evergreen-ui'


function Feed() {
  const url = process.env.APP_DOMAIN || 'http://localhost:4000'
  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/articles`: `${baseUrl}/articles`
  const [feed, setFeed] = useState([])
  const [limit, setLimit] = useState(5)
  const [isMore, setIsMore] = useState(false)
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
    axios.get(apiUrl) // ${baseUrl}
        .then(response => {
            setFeed(response.data);
            setFetch({
              isLoading: false,
              isError: false,
              error: null
            })
            console.log(feed)
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

  useEffect(() => {
    if (feed.length > limit){
      setIsMore(true)
    }
    if (limit >= feed.length){
      setIsMore(false)
    }
  }, [feed, limit])

  function LoadMore(){
    setLimit(limit + 5)
  }

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
            {feed.slice(0).reverse().slice(0,limit).map((article, index) =>
              <ArticleBlock key={article._id} article={article} index={index + 1} number={articleCount - index}/>
            )}
          </div>
      }
      {isMore ?
        <Button style={{display: "block", marginLeft: "auto", marginRight: "auto", marginBottom: '15px', marginTop: '15px'}} height={24} onClick={LoadMore}>Load more</Button>
        :
        null
      }
    </div>
  )
}

export default Feed

//{articleCount < 1 ? <div> No Articles yet... </div> : null}
