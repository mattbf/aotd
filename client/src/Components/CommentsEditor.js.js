import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { draftToHtml } from 'draftjs-to-html';
import { htmlToDraft } from 'html-to-draftjs';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function ArticleEditor(props) {
  //const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Your Comment here...","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     editorState: EditorState.createEmpty(),
  //   };
  // }

  // onEditorStateChange: Function = (editorState) => {
  //   this.setState({
  //     editorState,
  //   });
  // }
  // console.log(props.initialContent)
  // console.log(content)
    return (
      <div style={{ height: '100%'}}>
      <Editor
        editorState={props.editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={props.onChange}
        //contentState={content}
        height='100%'
        toolbar={{
          options: ['inline',
          'blockType',
          'list',
          'link',
        ],
          inline: {
            inDropdown: true,
            options: ['bold', 'italic', 'underline', 'strikethrough',],
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote',],
          },
          list: {
            inDropdown: true,
            options: ['unordered', 'ordered',],
          }
        }}
      />
      </div>
    )
}

export default ArticleEditor


// removed buttons
// 'emoji', 'image', 'embedded', 'colorPicker', 'fontFamily',
