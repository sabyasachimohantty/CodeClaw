import Editor from '@monaco-editor/react'
import { useRef, useState } from 'react'
import { useParams } from 'react-router'

const CodeEditor = () => {
  const editorRef = useRef(null)

  const {title} = useParams()
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState('python')
  const [languageName, setLanguageName] = useState('Python')
  const [languageId, setLanguageId] = useState(92)
  const [active, setActive] = useState(false)
  const [totalTestcases, setTotalTestcases] = useState(0)
  const [acceptedTestcases, setAcceptedTestcases] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const languages = [
    {
      id: 92,
      name: 'python',
      val: 'Python'
    },
    {
      id: 54,
      name: 'cpp',
      val: 'C++'
    },
    {
      id: 62,
      name: 'java',
      val: 'Java'
    },
    {
      id: 97,
      name: 'javascript',
      val: 'Javascript'
    }
  ]

  const dropdownItems = languages.filter((language) => language.id !== languageId)
  const listItems = dropdownItems.map(language => 
  <li 
    key={language.id} 
    className='bg-slate-900 text-white font-mono px-4 py-1'
    onClick={() => {
      setLanguage(language.name)
      setLanguageId(language.id)
      setLanguageName(language.val)
      setActive(false)
    }}>
      {language.val}
  </li>
  )


  function toggleDropdown() {
    if (active) {
      setActive(false)
    } else {
      setActive(true)
    }
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
  }

  async function handleSubmit() {
    let code = editorRef.current.getValue()

    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ code, languageId, title })
    })

    const result = await response.json()
    setAcceptedTestcases(result.acceptedTestcases)
    setTotalTestcases(result.totalTestcases)
    setIsSubmitted(true)
    console.log(result)
  }

  return (
    <div className='flex-1'>
      <div className='bg-slate-900 text-white font-mono px-4 py-1'
        onClick={toggleDropdown}>
        {languageName}
      </div>
      <div className={`${!active ? 'hidden' : ''}`}>
        <ul>
          {listItems}
        </ul>
      </div>
      <Editor
        height='60vh'
        defaultLanguage='python'
        defaultValue=''
        theme='vs-dark'
        onMount={handleEditorDidMount}
        language={language}
      />
      <button className='bg-slate-900 text-green-500 font-mono px-3 py-2 rounded-sm'
        onClick={handleSubmit}
      >
        Submit
      </button>
      <div className='bg-slate-950 h-60 text-white'>
        { isSubmitted ? <div>{acceptedTestcases}/{totalTestcases} Accepted</div> : ''}
      </div>
    </div>
  )
}

export default CodeEditor