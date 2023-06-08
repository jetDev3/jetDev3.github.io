export const createTOF = (quizNum, quizLength) => {
  const quizContainer = document.createElement('div')

  quizContainer.className = 'TOF question-container'

  quizContainer.innerHTML = `
      <div class="quiz-info">
        
        <div class="quiz-num-container">
          <span class="curr-quiz-num">${quizNum}</span>
          <span>/</span>
          <div class="total-num">${quizLength}</div>
        </div>
      </div>
      <div class="question-data-container">
        <input type="text" class="question" placeholder="Type your question here..." autofocus required>
      </div>
      <div class="answer-container">
        <div class="true opt">T</div>
        <div class="false opt">F</div>
      </div>
  `

  const answers = quizContainer.querySelectorAll('.opt')

  answers.forEach(answer => {
    answer.addEventListener('click', (e) => {
      answers.forEach(btn => {
        btn.classList.remove('answer')
      })
      e.target.classList.add('answer')
    })
  })
  return quizContainer
}
