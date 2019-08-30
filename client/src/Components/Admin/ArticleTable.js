import React from 'react'
import {
  Pane,
  Button,
  Text,
  Heading,
  Table,
} from 'evergreen-ui'

function ArticleTable(props) {
  const articles = props.articles
  return(
    <div>
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>
          Title
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Author
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          posted
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Comments
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {articles.map(article => (
          <Table.Row key={article._id} isSelectable onSelect={() => alert(article.title)}>
            <Table.TextCell>{article.title}</Table.TextCell>
            <Table.TextCell>{article.author}</Table.TextCell>
            <Table.TextCell>{article.createdAt}</Table.TextCell>
            <Table.TextCell isNumber>
              {article.comments.length}
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
      </Table>
    </div>
  )
}

export default ArticleTable
