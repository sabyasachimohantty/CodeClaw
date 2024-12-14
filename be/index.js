const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')

const app = express()
const port = 3000

// MIDDLEWARES
app.use(cors())
app.use(express.json())

const submitCode = async (code, languageId) => {

  const submissionData = {
    source_code: code,
    language_id: languageId,
    stdin: ""
  }

  try {
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '48de2ae3c6msh0c773b89cbad10bp1a447bjsnab904f7bb03f',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify(submissionData),
    });
  
    if (!response.ok) {
      throw new Error(`Error submitting code: ${response.statusText}`)
    }
  
    const result = await response.json()
  
    return result.token
  } catch (error) {
    throw new Error("Error during submitCode: ", error)
  }

}

const pollResults = async (token) => {
 
  try {
    while (true) {
      const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': '48de2ae3c6msh0c773b89cbad10bp1a447bjsnab904f7bb03f',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
      });
  
      if(!response.ok) {
        throw new Error("Error polling result: ", response.statusText)
      }
  
      result = await response.json()
  
      if (result.status && (result.status.id !== 2 || result.status.id !== 1)) {
        return result
      } else {
        console.log("Still waiting for result...")
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  } catch (error) {
    throw new Error("Error while pollingResults: ", error)
  }

}

const getDescription = async (title) => {

  try {
    const data = await fs.readFile(`./src/problems/${title}/description.md`, { encoding: 'utf8' });
    return data
  } catch (err) {
    throw new Error("Error while reading description", err)
  }

}


// ROUTES
app.post('/submit', async (req, res) => {
  const code = req.body.code
  const languageId = req.body.languageId
  console.log(languageId)
  try {
    const token = await submitCode(code, languageId)
    const output = await pollResults(token)
    console.log(output)
    res.json(output)
  } catch (error) {
    console.log("Error from /submit: ", error)
  }
})

// TODO
app.get('/problems/:title', async (req, res) => {
  const title = req.params.title
  try {
    const description = await getDescription(title)
    console.log(description)
    res.json({description})
  } catch (error) {
    console.log('Error form /problems/:title', error)
  }

})

app.listen(port, () => {
  console.log(`Server is successfully running on port ${port}`)
})
