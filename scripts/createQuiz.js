const p = console.log;
import { isUserSignedIn, storeQuizDataOnDb, getExistingThumbnail } from './db.js'
import { createTOF } from './quizzesTemplate/tof.js'
const createQuizBtn = document.querySelector('.createQuizBtn')
const templateContainer = document.querySelector('.quiz-template-container')
const selectTemplate = document.querySelector('.select-quiz-template')
const cancelQuizCreate = selectTemplate.querySelector('.cancelBtn')
const cancelQuestionCreate = templateContainer.querySelector('.cancelBtn')
const uploadQuiz = selectTemplate.querySelector('.uploadBtn')
const addQuestion = templateContainer.querySelector('.uploadBtn')
const loading = document.querySelector('.loading')
const questionList = document.querySelector('.question-list')
const selectedSubjet = selectTemplate.querySelector("#Subject")
const thumbnailImg = document.querySelector('#thumbnailImg')

const quizQuestions = []
let thumbnailUrl = null

createQuizBtn.addEventListener('click', () => {

  const quizType = document.querySelector('#quizType').value.trim()
  const questionNum = questionList.childElementCount
  
  

  const tof = createTOF(questionNum)

  templateContainer.append(tof)

  templateContainer.classList.remove('hide')
  selectTemplate.classList.add('hide')
})


isUserSignedIn(loading)
  .then((result) => {
    if (result.signedIn) {
      const uid = result.uid

      cancelQuizCreate.addEventListener('click', () => {
        p(window.location.href = `Dashboard.html?uid=${result.uid}`)
        /*
                window.location.href = ""
                window.location.href = `./components/Dashboard.html?uid=${result.uid}`*/
      })



      cancelQuestionCreate.addEventListener("click", () => {
        templateContainer.classList.add('hide')
        selectTemplate.classList.remove("hide")
      })

      document.querySelector('#thumbnailInput').addEventListener('change', (e) => {
        const file = e.target.files[0]

        const reader = new FileReader();
        reader.onload = function(e) {
          const thumbnailDataURL = e.target.result;
          
          thumbnailImg.src = thumbnailDataURL
          
          thumbnailUrl = thumbnailDataURL

        };
        reader.readAsDataURL(file);
      })

      addQuestion.addEventListener('click', () => {
        const optData = {}
        let id = generateId()
        const questContainer = document.querySelector('.question-container')
        const question = questContainer.querySelector('.question').value
        const opts = document.querySelectorAll('.opt')
        const answer = document.querySelector('.answer').textContent
        opts.forEach((opt, i) => {
          optData[`opt${i}`] = opt.innerHTML
        })
        const questionNum = questionList.childElementCount
  p(questionNum)
  if (questionNum >= 1) {
    selectedSubjet.disabled = true
  }
        
        
        
        if (question) {
          const qdata = storeQuizData(question, optData, answer, id)
          quizQuestions.push(qdata)
          templateContainer.querySelector(".question-container").remove()
          templateContainer.classList.add('hide')
          selectTemplate.classList.remove("hide")
          createQuesEl()
        } else {
          alert("Please provide a question")

        }
      })


      uploadQuiz.addEventListener("click", () => {

        if (questionList.childElementCount - 1 >= 5) {
          const quizSubj = selectedSubjet.value
          
          const thumbnails = getExistingThumbnail()
          storeQuizDataOnDb(quizQuestions, uid, loading, quizSubj, thumbnailUrl, thumbnails)
        } else {
          alert("The minimum requirements of 5 for questions has not been met")
        }

      })
    }
  })

const createQuesEl = () => {
  const questEl = document.createElement("div")
  questionList.append(questEl)
}

const generateId = () => {
  return Math.random() * 1000
}


function storeQuizData(question, opts, answer, id) {

  const quizData = {
    id: id,
    question: question,
    options: opts,
    answer: answer
  }
  return quizData
}


const getQuestions = () => {
  return JSON.parse(localStorage.getItem('quizData') || [])
}


const storeToLocalStorage = (quizData) => {
  localStorage.setItem('quizData', JSON.stringify(quizData));
  p(localStorage.getItem("quizData"))
}