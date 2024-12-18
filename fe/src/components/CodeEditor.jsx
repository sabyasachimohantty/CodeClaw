import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

const CodeEditor = () => {

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

  const editorRef = useRef(null)

  const { title } = useParams()

  const [outputs, setOutputs] = useState([])
  const [expectedOutputs, setExpectedOutputs] = useState([])
  const [testcases, setTestCases] = useState([])
  const [activeCase, setActiveCase] = useState([])
  const [activeCaseId, setActiveCaseId] = useState(0)

  const [language, setLanguage] = useState('python')
  const [languageName, setLanguageName] = useState('Python')
  const [languageId, setLanguageId] = useState(92)
  const [active, setActive] = useState(false)
  const [editorVal, setEditorVal] = useState('')

  const [totalTestcases, setTotalTestcases] = useState(0)
  const [acceptedTestcases, setAcceptedTestcases] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchTestcases = async () => {
      const response = await fetch(`http://localhost:3000/testcases/${title}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      const res = await response.json()
      setTestCases(res.testcases)
      setActiveCase(res.testcases[0].split('\n'))
      setActiveCaseId(0)
    }

    fetchTestcases()
  }, [])

  useEffect(() => {
    const fetchFuntionSignature = async () => {
      const response = await fetch(`http://localhost:3000/function-signature/${title}/${language}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      const res = await response.json()
      setEditorVal(res.functionSignature)
    }

    fetchFuntionSignature()
  }, [language])

  const dropdownItems = languages.filter((language) => language.id !== languageId)
  const listItems = dropdownItems.map(language =>
    <li
      key={language.id}
      className='bg-stone-950 text-white px-5 min-w-32 py-2 rounded-br-lg font-bold text-center'
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
      body: JSON.stringify({ code, languageId, title, language })
    })

    const result = await response.json()
    setAcceptedTestcases(result.acceptedTestcases)
    setTotalTestcases(result.totalTestcases)
    setOutputs(result.outputs)
    setExpectedOutputs(result.expectedOutputs)
    setIsSubmitted(true)
    console.log(result)
  }

  return (
    <div className='flex-1 flex flex-col'>

      {/* Editor Tab */}
      <div className='mr-3'>

        <div className='text-white py-1 px-6 text-sm bg-stone-900 rounded-t-lg'>
          Code
        </div>

        <Editor
          height='45vh'
          defaultLanguage='python'
          defaultValue=''
          theme='vs-dark'
          onMount={handleEditorDidMount}
          language={language}
          value={editorVal}
        />

        <div className='bg-stone-900 rounded-b-lg flex justify-between relative'>
          <div>
            <button onClick={handleSubmit}
              className='px-5 py-2 bg-stone-950 rounded-bl-lg text-green-600 font-bold hover:bg-stone-800'>
              Submit
            </button>
            <button
              className='text-white px-5 py-2 bg-stone-950 font-bold hover:bg-stone-800'>
              Run
            </button>
          </div>
          <div className={`${!active ? 'hidden' : ''} absolute bottom-10 right-0`}>
            <ul>
              {listItems}
            </ul>
          </div>
          <div className='bg-stone-950 text-white px-5 min-w-32 py-2 rounded-br-lg font-bold text-center'
            onClick={toggleDropdown}>
            {languageName}
          </div>

        </div>

      </div>

      {/* Testcases Tab */}
      <div className='bg-stone-950 flex-grow text-white rounded-lg my-2 mr-3 overflow-hidden flex flex-col'>

        <div className='py-2 px-5 bg-stone-900 rounded-t-lg'>
          Testcases
        </div>

        <div className='overflow-y-scroll'>

          <div className='py-3 px-5 flex gap-4 text-sm'>
            {testcases.map((testcase, i) =>
              <span key={i}
                className={`py-2 px-3 rounded-lg hover:bg-stone-900 ${activeCaseId === i ? 'bg-stone-900' : ''}
                          ${isSubmitted ? (outputs[i].status.id === 3 ? 'text-green-600' : 'text-red-600') : ''}`}
                onClick={() => {
                  setActiveCaseId(i)
                  setActiveCase(testcases[i].split('\n'))
                }}>
                Case {i + 1}
              </span>
            )}
          </div>

          <div className='py-3 px-5'>
            <div className='bg-stone-900 rounded-lg'>
              {activeCase.map((input, i) =>
                <div key={i} className='py-1 px-3'>
                  {input}
                </div>
              )}
            </div>

            {isSubmitted &&
              <div className='mt-3'>
                <div className='font-thin text-sm'>
                  Output =
                </div>
                <div className='bg-stone-900 rounded-lg'>
                  <div className='py-2 px-3'>
                    {outputs[activeCaseId].stdout}
                  </div>
                </div>
              </div>
            }

            {isSubmitted &&
              <div className='mt-3'>
                <div className='font-thin text-sm'>
                  Expected Output =
                </div>
                <div className='bg-stone-900 rounded-lg'>
                  <div className='py-2 px-3'>
                    {expectedOutputs[activeCaseId]}
                  </div>
                </div>
              </div>
            }


          </div>

        </div>

      </div>

    </div>
  )
}

export default CodeEditor