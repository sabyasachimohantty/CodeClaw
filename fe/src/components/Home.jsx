import React from 'react'

const Home = () => {

    async function handleClick() {
        console.log("Click")
        const response = await fetch('http://localhost:3000/problems/two-sum', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          })

        const res = await response.json()
        console.log(res)
    }

  return (
    <div className='flex justify-center'>
        <ul>
            <li className='p-5 bg-slate-800 text-white rounded-md' onClick={handleClick}>Two Sum</li>
            <li className='p-5 bg-slate-800 text-white rounded-md'>Three Sum</li>
        </ul>
    </div>
  )
}

export default Home