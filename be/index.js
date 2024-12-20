const express = require('express')
const cors = require('cors')
const fsPromise = require('fs/promises')
const fs = require('fs')
const readline = require('readline')
const problemSet = require('./src/problems/problemSet.js')
const extensions = require('./src/constants/extensions.js')

const app = express()
const port = 3000

// MIDDLEWARES
app.use(cors())
app.use(express.json())

const getInputs = async (title) => {
  try {
    const fileStream = fs.createReadStream(`./src/problems/${title}/testcases.txt`);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    let inputs = []
    let input = ''
    for await (const line of rl) {
      if (line.length === 0) {
        inputs.push(input)
        input = ''
        continue
      } 
        
      input = input + line + '\n'
    }
    inputs.push(input)
    return inputs
  } catch (error) {
    throw new Error('Error while getting inputs', error)
  }
}

const getExpectedOutputs = async (title) => {
  try {
    const fileStream = fs.createReadStream(`./src/problems/${title}/expectedOutput.txt`);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    let expectedOutputs = []
    for await (const line of rl) {
      expectedOutputs.push(line + '\n')
    }
    
    return expectedOutputs
  } catch (error) {
    throw new Error('Error while getting expected output', error)
  }
}

const submitCode = async (code, languageId, inputs, expectedOutputs) => {

  const submissionData = inputs.map((input, i) => {
    return {
      source_code: code,
      language_id: languageId,
      stdin: input,
      expected_output: expectedOutputs[i]
    }
  })

  try {
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '48de2ae3c6msh0c773b89cbad10bp1a447bjsnab904f7bb03f',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({submissions: submissionData}),
    });
  
    if (!response.ok) {
      throw new Error(`Error submitting code: ${response.statusText}`)
    }
  
    const result = await response.json()
    return result
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

const getAcceptedTestcases = (expectedOutputs, stdouts) => {
  const acceptedCases = expectedOutputs.filter((expectedOutput, index) => expectedOutput === stdouts[index])
  return acceptedCases.length
}

const getDescription = async (title) => {

  try {
    const data = await fsPromise.readFile(`./src/problems/${title}/description.md`, { encoding: 'utf8' });
    return data
  } catch (err) {
    throw new Error("Error while reading description", err)
  }

}

const getFunctionSignature = async (title, language, extension) => {
  try {
    const data = await fsPromise.readFile(`./src/problems/${title}/boilerplate/${language}/function.${extension}`, { encoding: 'utf8' })
    return data
  } catch (error) {
    throw new Error('Error while getting function signature', error)
  }
}

const getFullCode = async (code, language, title) => {
  try {
    const extension = extensions.get(language)
    const data = await fsPromise.readFile(`./src/problems/${title}/boilerplate/${language}/input.${extension}`, { encoding: 'utf8' });
    const fullCode = data.replace('# CODE HERE #', code)
    console.log(fullCode);
    return fullCode
  } catch (err) {
    throw new Error('Error while getting full code', err)
  }
}

// ROUTES
app.post('/submit', async (req, res) => {
  const code = req.body.code
  const languageId = req.body.languageId
  const title = req.body.title
  const language = req.body.language
  const userId = req.body.userId

  try {
    const fullCode = await getFullCode(code, language, title)
    const inputs = await getInputs(title)
    const expectedOutputs = await getExpectedOutputs(title)
    const tokens = await submitCode(fullCode, languageId, inputs, expectedOutputs)
    const outputs = await Promise.all(tokens.map(async ({token}) => await pollResults(token)))
    console.log(outputs)
    const stdouts = outputs.map((output) => output.stdout)
    const totalTestcases = inputs.length
    const acceptedTestcases = getAcceptedTestcases(expectedOutputs, stdouts)
    console.log(acceptedTestcases)
    res.json({totalTestcases, acceptedTestcases, outputs, expectedOutputs})
    console.log(userId)
  } catch (error) {
    console.log("Error from /submit: ", error)
  }
})

app.get('/problems/:title', async (req, res) => {
  const title = req.params.title
  try {
    const description = await getDescription(title)
    res.json({description})
  } catch (error) {
    console.log('Error form /problems/:title', error)
  }

})

app.get('/problemset', (req, res) => {
  res.json({problemSet})
})

app.get('/testcases/:title', async (req, res) => {
  const title = req.params.title
  try {
    const testcases = await getInputs(title)
    res.json({testcases})
  } catch (error) {
    console.log("Error from /testcases/:title", error)
  }
})

app.get('/function-signature/:title/:language', async (req, res) => {
  try {
    const {title, language} = req.params
    const extension = extensions.get(language)
    const functionSignature = await getFunctionSignature(title, language, extension)
    res.json({functionSignature})
  } catch (error) {
    console.log('Error from /function-signature', error)
  }
})


app.listen(port, () => {
  console.log(`Server is successfully running on port ${port}`)
})
