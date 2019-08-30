import React from 'react'
import Comment from './Comment'
import {
  Pane,
  Button,
  Text,
  Heading,
} from 'evergreen-ui'

const divider = {
  backgroundColor: '#ececec',
  height: '3px',
  width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '20px',

}


function Comments(props) {
  const comments = props.comments
  return (
    <div>
        {comments ?
          comments.map((comment, index) =>
          <Comment key={index} comment={comment} index={index + 1}/>
        )

      :
      <Text> Loading comments... </Text>
    }
    <div style={divider} > </div>
    </div>
  )
}

export default Comments
