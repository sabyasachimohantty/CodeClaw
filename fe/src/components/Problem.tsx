import React from 'react'
import ProblemDesc from './ProblemDesc'
import CodeEditor from './CodeEditor'

const Problem = () => {
  return (
    <div className='flex h-screen'>
        <ProblemDesc />
        <CodeEditor />
    </div>
  )
}

export default Problem