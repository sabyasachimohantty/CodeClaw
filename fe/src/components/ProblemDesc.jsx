import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router'

const ProblemDesc = () => {

  const {title} = useParams()
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      const response = await fetch(`http://localhost:3000/problems/${title}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      })
  
      const problem = await response.json()
      setMarkdown(problem.description)
    }

    fetchProblem()
  }, []);

  console.log(markdown)

  return (
    <div className='markdown-container bg-black text-white flex-1 px-5 py-4 overflow-y-scroll'>
      <Markdown>{markdown}</Markdown>
    </div>
  )
}

export default ProblemDesc