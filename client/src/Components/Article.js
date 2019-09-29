import React, {useEffect, useState} from 'react';
import useGlobal from '../GlobalState/Store/Store';
import axios from 'axios'
import { Link } from "react-router-dom";
import { HashLink as SectionLink } from 'react-router-hash-link';
import Navbar from './Navbar'
import Comments from './Comments'
import { timeDifferenceForDate } from '../Utils/TimeDif.js';
import { PrettyUrl } from '../Utils/PrettyUrl.js';
import useWindowSize from '../Utils/useWindowSize'
import { convertFromHTML, convertToHTML } from "draft-convert"

import ArticleViewer from './ArticleViewer.js';
import CommentPost from './CommentPost.js';
import htmlToDraft from 'html-to-draftjs';

import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";

import {
  Pane,
  Button,
  Text,
  Heading,
  Avatar,
  TextInput,
  toaster
} from 'evergreen-ui'

import {CopyToClipboard} from 'react-copy-to-clipboard';
import MetaTags from 'react-meta-tags';
import MetaImg from '../AOTD-metaimage.png'

//const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};

function Article(props) {
  const [globalState, globalActions] = useGlobal();
  const user = globalState.user
  const auth = globalState.isAuth
  const articleTitle = props.match.params.title
  const slug = PrettyUrl(articleTitle)

  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/articles/${slug}`: `${baseUrl}/articles/${slug}`

  const windowSize = useWindowSize()
  const isMobile = windowSize.width < 700 ? true : false

  console.log(apiUrl)
  const url = `http://localhost:4000/articles/${slug}` //http://localhost:4000
  //const domain = process.env.APP_DOMAIN
  const requrl = 'aotd.ca'//process.env.APP_DOMAIN || 'http://localhost:4000'
  const copyUrl = `${requrl}/${slug}` || `http://localhost:4000/article/${slug}`
  //const id = props.id
  const [fetch, setFetch] = useState({
    isLoading: false,
    isError: false,
    error: null
  })
  const [commentFetch, setCommentFetch] = useState({
    isLoading: false,
    isError: false,
    commentSet: false,
    error: null
  })
  const [article, setArticle] = useState({
    data: [],
    timeago: '',
    commentsCount: 0
  })
  const [refresh, setRefresh] = useState(1)

  //For artitcle
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const onChangeEditor = (editorState) => {
    setEditorState(editorState)
  }

  //for comments
  const [commentsEditorState, setCommentsEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const [clearComment, setClearComment] = useState(0)

  const onChangeCommentsEditor = (commentsEditorState) => {
    setCommentsEditorState(commentsEditorState)
    setCommentFetch({
      isLoading: false,
      isError: false,
      commentSet: true,
      error: null
    })

    if(rawCommentContentState.blocks[0].text == undefined || "Your Comment here..." && clearComment == 0) {
      const emptyState = EditorState.push(editorState, ContentState.createFromText(''));
      setCommentsEditorState(emptyState)
      setClearComment(1)
    }
  }


  const rawCommentContentState = convertToRaw(
    commentsEditorState.getCurrentContent()
  );


  useEffect(() => {
    setFetch({
      isLoading: true,
      isError: false,
      error: null
    })

    //console.log(url)
    axios.get(apiUrl, {withCredentials: true, useCredentials: true }) //removed ${requrl} from start of url
        .then(response => {
            // console.log("fetched article")
            console.log(response.data.body)

            setArticle({
              data: response.data,
              timeago: timeDifferenceForDate(response.data.createdAt),
              commentsCount: response.data.comments ? response.data.comments.length : 0
            });
            setFetch({
              isLoading: false,
              isError: false,
              error: null
            })
            setEditorState(
              EditorState.createWithContent(convertFromRaw(JSON.parse(response.data.body)))
            )


            //console.log(response.data.body)
        })
        .catch(function (error){
          setFetch({
            isLoading: false,
            isError: true,
            error: {
              error: error,
              code: error.message.substring(error.message.length - 3, error.message.length)
            }
          })
            console.log(error);

        })
  }, [refresh])

  function PostComment() {
    setCommentFetch({
      isLoading: true,
      isError: false,
      commentSet: true,
      error: null
    })
    const commenturl = process.env.NODE_ENV == "production" ? `/articles/${slug}/comments`: `${baseUrl}/articles/${slug}/comments`
    axios({
      method: 'post',
      url: commenturl,
      data:{
        body: JSON.stringify(rawCommentContentState),
      	author: user.username,
      }
    })
      .then(response => {
        console.log(response)
        setCommentFetch({
          isLoading: false,
          isError: false,
          commentSet: true,
          error: null
        })
        setRefresh(refresh + 1)
        const emptyState = EditorState.push(editorState, ContentState.createFromText(''));
        setCommentsEditorState(emptyState)
      })
      .catch(function(error) {
        setCommentFetch({
          isLoading: false,
          isError: true,
          commentSet: true,
          error: error
        })
        console.log(error);
      })
  }


  return(

    <div>
    <div> is Mobile? {isMobile.toString()} </div>
      <MetaTags>
        <title>AOTD | {articleTitle}</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="MyApp" />
        <meta property="og:image" content={MetaImg} />
      </MetaTags>
      <Navbar/>
      <div style={{width: '100%', display: 'flex', alignItems: 'flex-end' }}>
        <CopyToClipboard text={copyUrl}
          onCopy={() => toaster.notify('Article URL copied to clipboard')}>
          <Button style={{marginTop: '15px', marginLeft: 'auto'}} marginRight={12} iconAfter="link">Share</Button>
        </CopyToClipboard>
      </div>
      {fetch.isError ?
        //fetch.error.statuscode == 401 ?
        fetch.error.code == 401 ?
        <div style={{display: 'flex', flexDirection: 'column', alignItems: !isMobile ? 'center' : 'flex-start', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', minHeight: '400px', width: '75%'}}>
          <Heading marginBottom={10} size={700}>Oops.. Looks like you are not logged in!</Heading>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
            <Link to={'/login'}>
              <Heading size={500} marginRight={5}>Login</Heading>
            </Link>
            <Heading size={500}>
            to enjoy the article
            </Heading>
            <Heading size={500} style={{color: '#2D80D4', marginLeft: '5px'}}>
              {articleTitle}
            </Heading>
          </div>
        </div>
        :
        <div style={{padding: '15px'}}>Error: {fetch.error.error.message}</div>
        :
        // <div>Error: {fetch.error.error.message}</div>
        // :
        <div>
          <Pane padding={15} background="#F7F9FD" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Pane display="flex" alignItems="center" marginBottom={10}>
              <Heading size={200} marginRight={5}>Posted by </Heading>
              <Link to={`/author/${article.data.author}`}>
                <Heading size={200} marginRight={5}>{article.data.author} |</Heading>
              </Link>
              <Heading size={200} marginRight={5}>{article.timeago} |</Heading>
              <SectionLink
                smooth
                to={`/article/${slug}#comments`}
              >
                <Text size={300} marginRight={3}>{article.commentsCount} comments</Text>
              </SectionLink>
            </Pane>
            <Heading size={800} marginBottom={20} textAlign='center' >{article.data.title}</Heading>
          </Pane>
          <Pane padding={15} background='#F7F9FD'>
            <Pane background="#FFFFFF" padding={24} marginBottom={16}>
              <ArticleViewer readOnly={false} editorState={editorState} onChange={onChangeEditor}/>
            </Pane>
          </Pane>
          <div id="comments">
            <Pane padding={15} background="#F7F9FD" paddingLeft={20} >
              <Heading size={700} marginBottom={20} >Comments</Heading>
              <div style={{backgroundColor: '#FFFFFF', padding: '25px'}}>
                {article.commentsCount == 0 ?
                  <div style={{marginBottom: '20px'}}> No Comments yet</div>
                  :
                  <Comments comments={article.data.comments} />
                }
                  {commentFetch.isError ?
                    <div>
                      <Text color="#EC4C47" size={300}> {commentFetch.error.message}</Text>
                    </div>
                    :
                    null
                  }
                  <div>
                    <CommentPost user={user} editorState={commentsEditorState} onChange={onChangeCommentsEditor}/>
                    <div style={{width: '100%', display: 'flex', alignItems: 'flex-end'}}>
                      <div style={{marginLeft: 'auto', marginRight: '0px'}}>
                        <Button disabled={!commentFetch.commentSet} isLoading={commentFetch.isLoading} marginRight={isMobile ? 0 : 45} appearance="primary" intent="success" onClick={PostComment}>
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>


              </div>
            </Pane>
          </div>
        </div>
      }
    </div>
  )
}

export default Article
