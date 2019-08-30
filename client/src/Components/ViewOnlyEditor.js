import React, {useState, useEffect} from 'react'
import { Editor,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState } from "draft-js";

const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
};

  function ViewOnlyEditor(props) {
    function findLinkEntities(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK'
          );
        },
        callback
      );
    }
    const Link = (props) => {
      const {url} = props.contentState.getEntity(props.entityKey).getData();
      return (
        <a href={url} style={styles.link}>
          {props.children}
        </a>
      );
    };
    function findImageEntities(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'IMAGE'
          );
        },
        callback
      );
    }
    const Image = (props) => {
      const {
        height,
        src,
        width,
      } = props.contentState.getEntity(props.entityKey).getData();
      return (
        <img src={src} height={height} width={width} />
      );
    };
      const decorator = new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link,
        },
        {
          strategy: findImageEntities,
          component: Image,
        },
      ]);
      const markup = props.markup
      const sampleMarkup =
        '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
        '<a href="http://www.facebook.com">Example link</a><br /><br/ >' +
        '<img src="image.png" height="112" width="200" />';
      const blocksFromHTML = convertFromHTML(sampleMarkup);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      const [editorState, setEditorState] = useState({
        editorState: EditorState.createWithContent(
          state,
          decorator,
        ),
      })


      return (
        <div style={styles.root}>
          <div style={{marginBottom: 10}}>
            Sample HTML converted into Draft content state
          </div>
          <div style={styles.editor} onClick={this.focus}>
            <Editor
              readOnly={true}
              editorState={editorState.editorState}
              ref="editor"
            />
          </div>
        </div>
      );
  }



      export default ViewOnlyEditor
