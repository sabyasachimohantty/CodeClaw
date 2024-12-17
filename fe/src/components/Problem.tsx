import React from 'react'
import ProblemDesc from './ProblemDesc'
import CodeEditor from './CodeEditor'
import Navbar from './Navbar'

const Problem = () => {
  return (
    <div className='flex flex-col max-h-screen bg-black gap-2'>
      <Navbar />
      <div className='flex gap-2 overflow-hidden flex-grow-0'>
        <ProblemDesc />
        <CodeEditor />
    </div>
    </div>
  )
}

export default Problem