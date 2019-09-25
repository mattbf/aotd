import React, { useEffect } from 'react';
import { EditorState, ContentState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import { draftToHtml } from 'draftjs-to-html';
import { htmlToDraft } from 'html-to-draftjs';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function CommentViewer(props) {
  const content = props.comment.body
  //console.log(content)
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
    //EditorState.createEmpty()
  );

  const onChangeEditor = (editorState) => {
    setEditorState(editorState)
  }

  useEffect(() => {
    //console.log('loaded')
    setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(content))))
  }, [])

    return (
      <div>
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onChangeEditor}
        readOnly={true}
        toolbarHidden={true}
        //contentState={props.initialState}

      />
      </div>
    )
}

export default CommentViewer


// import React, { Component } from 'react';
// import { convertFromRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
//import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//
// const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
//
// class ArticleEditor extends Component {
//   constructor(props) {
//     super(props);
//     const contentState = convertFromRaw(content);
//     this.state = {
//       contentState,
//     }
//   }
//
//   onContentStateChange: Function = (contentState) => {
//     this.setState({
//       contentState,
//     });
//   };
//
//   render() {
//     const { contentState } = this.state;
//     return (
//       <div>
//       <Editor
//         editorState={contentState}
//         wrapperClassName="demo-wrapper"
//         editorClassName="demo-editor"
//         onEditorStateChange={this.onContentStateChange}
//         readOnly={this.props.readOnly}
//         toolbarHidden={this.props.readOnly}
//       />
//       <textarea
//           disabled
//           value={JSON.stringify(contentState, null, 4)}
//         />
//       </div>
//     );
//   }
// }
//
// export default ArticleEditor

// <Editor
//   wrapperClassName="demo-wrapper"
//   editorClassName="demo-editor"
//   onContentStateChange={this.onContentStateChange}
//   readOnly={this.props.readOnly}
//   toolbarHidden={this.props.readOnly}
// />
