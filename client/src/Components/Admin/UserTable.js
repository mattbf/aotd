import React, {useState} from 'react'
import {
  Pane,
  Button,
  Text,
  Heading,
  Table,
  Popover,
  Menu,
  IconButton,
  toaster,
  Position,
} from 'evergreen-ui'

function UserTable(props) {
  const users = props.users
  const [close, setClose] = useState(true)

  const UserPopover = (user) => (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
    <Menu>
      <Menu.Group>
        <Menu.Item
          onSelect={() => toaster.notify('Share')}
        >
          Share...
        </Menu.Item>
        <Menu.Item
          onSelect={() => toaster.notify('Move')}
        >
          Move...
        </Menu.Item>
        <Menu.Item
          onSelect={() => toaster.notify('Rename')}
          secondaryText="⌘R"
        >
          {user.username}
        </Menu.Item>
      </Menu.Group>
      <Menu.Divider />
      <Menu.Group>
        <Menu.Item
          onSelect={() => toaster.danger('Delete')}
          intent="danger"
        >
          Delete...
        </Menu.Item>
      </Menu.Group>
    </Menu>
  }
>
  <IconButton marginBottom={16} appearance="minimal" icon="more" />
</Popover>
)

  return(
    <div>
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>
          ID
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          User
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Email
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Role
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Created
        </Table.TextHeaderCell>
        <Table.TextHeaderCell>
          Delete USer
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {users.map(user => (
          <Table.Row key={user._id}>
            <Table.TextCell>{user._id}</Table.TextCell>
            <Table.TextCell>{user.username}</Table.TextCell>
            <Table.TextCell>{user.email}</Table.TextCell>
            <Table.TextCell>{user.role}</Table.TextCell>
            <Table.TextCell>{user.createdAt}</Table.TextCell>
            <Table.Cell><IconButton marginBottom={16} appearance="minimal" icon="trash" intent="danger" /></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      </Table>
    </div>
  )
}

export default UserTable

//<Table.Cell><UserPopover/></Table.Cell>

//isSelectable onSelect={() => alert(user.username)}
