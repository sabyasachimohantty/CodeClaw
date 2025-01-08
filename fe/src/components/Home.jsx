import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from './Navbar';

const Home = () => {

  const BE_URL = 'https://codeclawapi.sabya.site'

  const navigate = useNavigate();
  const [problemSet, setProblemSet] = useState([]);

  useEffect(() => {

    async function fetchProblemSet() {

      const response = await fetch(`${BE_URL}/problemset`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      const data = await response.json()
      setProblemSet(data.problems)
    }

    fetchProblemSet()

  }, [])

  function handleClick(title) {
    const id = title.toLowerCase().replaceAll(' ', '-')
    navigate(`/problem/${id}`)
  }

  const problems = problemSet.map((problem, index) =>
    <tr key={index} className={`${index % 2 === 1 ? "bg-stone-900" : ""}`}>
      <td className='px-4 py-3'>

      </td>
      <td className='px-4 py-3 hover:text-blue-600' onClick={() => handleClick(problem.title)}>
        {problem.id + ". " + problem.title}
      </td>
      <td className={`px-4 py-3 ${problem.difficulty === 'Easy' ? 'text-green-500' : (problem.difficulty === 'Medium' ? 'text-orange-400' : 'text-red-600')}`}>
        {problem.difficulty}
      </td>
      <td className='px-4 py-3'>

      </td>
    </tr>
  )

  return (
    <div className='flex flex-col h-screen text-white'>
      <Navbar />
      <div className='flex justify-center items-center bg-stone-950 flex-grow'>
        <table className=''>
          <thead>
            <tr className='text-gray-400 text-sm text-left border-b'>
              <th className='p-4'>Status</th>
              <th className='p-4'>Title</th>
              <th className='p-4'>Difficulty</th>
              <th className='p-4'>Solution</th>
            </tr>
          </thead>
          <tbody>
            {problems}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home