import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'

function App() {

  const editorRef = useRef(null)

  const [output, setOutput] = useState('')

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
  }

  async function handleClick() {
    let code = editorRef.current.getValue()

    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({code})
    })
    
    const result = await response.json()
    setOutput(result.stdout)
    console.log(result)
  }

  return (
    <>
      <Editor 
        height='60vh'
        defaultLanguage='python'
        defaultValue='//write your code below'
        theme='vs-dark'
        onMount={handleEditorDidMount}
      />
      <br />
      <button onClick={handleClick}>Submit</button>
      <br />
      <br />
      <div style={{height: '200px', width: '400px', backgroundColor: 'black', color: 'white'}}>
        {output}
      </div>
    </>
  )
}

export default App
