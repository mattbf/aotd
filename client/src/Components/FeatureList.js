import React, {useEffect, useState} from 'react'
import FeatureBlock from './FeatureBlock'
import axios from 'axios'
import {
  Heading,
  Pane,
  Spinner
} from 'evergreen-ui'


function FeatureList() {
  const url = process.env.APP_DOMAIN || 'http://localhost:4000'
  const baseUrl = 'http://localhost:4000'
  const apiUrl = process.env.NODE_ENV == "production" ? `/articles`: `${baseUrl}/articles`
  const [features, setFeatures] = useState([
    {
      title: "Email notifications",
      feature: "Notifications",
      releaseDate: new Date(2019, 11, 4),
      description: "Email notifications will now be sent to users when a new article is posted. Authors will also be notified when someone comments on their article"
    },
    {
      title: "Beta Release",
      feature: "Beta",
      releaseDate: new Date(2019, 9, 1),
      description: "Introducing AOTD: View, publish, and comment on articles."
    },
  ])

  return (
    <div>
          <div style={{paddingBottom: "25px", paddingTop: "25px"}}>
            {features.map((feature, index) =>
              <FeatureBlock key={index} feature={feature}/>
            )}
          </div>
    </div>
  )
}

export default FeatureList
