import React from 'react'
import { Pane, Button, Text, Heading, Icon, Pill, Badge } from 'evergreen-ui'
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

function FeatureBlock(props) {
  //var url = props.article.title.split(' ').join('-')
  var timeago = timeDifferenceForDate(props.feature.releaseDate)
  return(
      <Pane display="flex" padding={16} background="#FFFFFF" borderRadius={3} margin={10} position='relative'>
        <div style={{display: 'flex', flexDirection: 'column',}}>
            <div>
              <Badge style={{marginBottom: "10px"}} color="green" isSolid marginRight={8}>{props.feature.feature}</Badge>
            </div>
            <div>
                <Heading style={articleLink} size={600} >{props.feature.title}</Heading>
              <div flex={1} alignItems="center" display="flex">
                <Text size={300} marginRight={3}> Released: </Text>
                <Text size={300}>  {timeago}</Text>
              </div>
            </div>
            <div>
              <Text size={400} marginRight={3}> {props.feature.description} </Text>
            </div>
        </div>
      </Pane>
  )
}

export default FeatureBlock
