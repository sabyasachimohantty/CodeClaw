import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router'

const ProblemDesc = () => {

  const BE_URL = 'http://ec2-13-201-104-89.ap-south-1.compute.amazonaws.com:3000'

  const { title } = useParams()
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      const response = await fetch(`${BE_URL}/problems/${title}`, {
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

  return (
    <div className='flex-1 ml-3 flex flex-col mb-2'>
      <div className='flex bg-stone-900 text-white text-sm rounded-t-lg'>
        <span className='py-1 px-3 hover:bg-stone-950 rounded-tl-lg'>Description</span>
      </div>
      <div className='markdown-container bg-stone-950 text-white px-5 py-4 flex-grow overflow-y-scroll rounded-b-lg'>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  )
}

export default ProblemDesc