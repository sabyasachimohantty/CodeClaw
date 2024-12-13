import Editor from '@monaco-editor/react'

const Editor = () => {
  return (
    <Editor 
        height='60vh'
        defaultLanguage={language}
        defaultValue='//write your code below'
        theme='vs-dark'
        onMount={handleEditorDidMount}
      />
  )
}

export default Editor