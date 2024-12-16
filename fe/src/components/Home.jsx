import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from './Navbar';

const Home = () => {

  const navigate = useNavigate();
  const [problemSet, setProblemSet] = useState([]);

  useEffect(() => {

    async function fetchProblemSet() {

      const response = await fetch('http://localhost:3000/problemset', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      const data = await response.json()
      setProblemSet(data.problemSet)
    }

    fetchProblemSet()

  }, [])

  function handleClick(title) {
    const id = title.toLowerCase().replaceAll(' ', '-')
    navigate(`/problem/${id}`)
  }

  const problems = problemSet.map((problem, index) => 
    <li key={index} onClick={() => handleClick(problem.title)}>
      {problem.title}
    </li>
  )

  return (
    <div className='relative h-screen bg-slate-800 text-white'>
      <Navbar />
      <div className='flex justify-center'>
        <ul>
          {problems}
        </ul>
      </div>
    </div>
  )
}

export default Home