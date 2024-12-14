import React, { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

const ProblemDesc = () => {

    const [markdown, setMarkdown] = useState('')

    useEffect(() => {
        // Fetch the markdown file from the public directory
        fetch("/problem.md")
          .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch Markdown file");
            return response.text();
          })
          .then((text) => setMarkdown(text))
          .catch((error) => console.error(error));
      }, []);

    console.log(markdown)

  return (
    <div className='markdown-container bg-black text-white flex-1 px-5 py-4 overflow-y-scroll'>
        <Markdown>{markdown}</Markdown>
    </div>
  )
}

export default ProblemDesc