import React from 'react'
import { Pane, Button, Text, Heading, Icon, Pill } from 'evergreen-ui'
import {Link} from 'react-router-dom'
import { timeDifferenceForDate } from '../Utils/TimeDif.js';
import { PrettyUrl } from '../Utils/PrettyUrl.js';
import { HashLink as SectionLink } from 'react-router-hash-link';

// position: 'absolute',
// left: '5px',
// top: '3px',
const articleLink = {
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: '#1070CA'
  }
}

function ArticleBlock(props) {
  //var url = props.article.title.split(' ').join('-')
  const slug = PrettyUrl(props.article.title)
  var timeago = timeDifferenceForDate(props.article.createdAt)

  var authorLink = `/author/${props.article.author}`
  const commentsCount = props.article.comments.length
  return(
      <Pane display="flex" padding={16} background="#FFFFFF" borderRadius={3} margin={10} position='relative'>
        <div style={{display: 'flex', flexDirection: 'row',}}>
            <div>
              <Pill display="inline-flex" color="blue" marginTop={5} marginRight={8}>{props.number}</Pill>
            </div>
            <div>
              <Link
                to={{
                  pathname: `/article/${slug}`,
                  state: {props},
                }}
                style={articleLink}
              >
                <Heading style={articleLink} size={600} >{props.article.title}</Heading>
              </Link>
              <div flex={1} alignItems="center" display="flex">
                <Text size={300} marginRight={1}>Posted by </Text>
                <Link to={authorLink} style={{marginTop: '-4px'}}>
                  <Text size={300} marginRight={3}>{props.article.author}</Text>
                </Link>
                <Text size={300} marginRight={3}> | </Text>
                <Text size={300}>  {timeago} | {commentsCount} comments</Text>
              </div>
            </div>
        </div>
      </Pane>
  )
}

export default ArticleBlock
