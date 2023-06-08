const p = console.log
import { createAcc, storeUsername, storeTeacherClasses, storeSecToLeaderboard,
 signInAcc} from './db.js'


const main = document.querySelector('main')
const switchFormBtn = document.querySelector('.switchForm')
const signupContainer = main.querySelector('.signUp-container')
const signinContainer = main.querySelector('.signIn-container')
const sectionContainer = main.querySelector('.section-form-container')
const sectionInputContainer = document.querySelector('.section-form-container .input-container')
const spanTxt = document.querySelector('header .spanTxt')
const addSecBtn = document.querySelector('#addsecBtn')
const span = document.querySelector('header .switch-container')
const loading = document.querySelector('.loading')






switchFormBtn.addEventListener('click', (e) => {
  let switchTxt = e.target.textContent

  if (switchTxt.trim() == 'Sign Up') {
    signinContainer.classList.add('hide')
    signupContainer.classList.remove('hide')
    spanTxt.textContent = 'Already have an account?'
    switchFormBtn.innerHTML = 'Sign In'
  } else {
    signinContainer.classList.remove('hide')
    signupContainer.classList.add('hide')
    spanTxt.textContent = "Don't have an account?"
    switchFormBtn.innerHTML = 'Sign Up'
  }
})

signupContainer.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupContainer.querySelector('#sign-up-email').value
  const password = signupContainer.querySelector('#sign-up-password').value
  const username = signupContainer.querySelector('.username').value
  const role = 'Teacher'
  
  createAcc(email, password, loading)
  storeUsername(username, role,loading)
  
  span.classList.add('hide')
  signupContainer.classList.add('hide')
  sectionContainer.classList.remove('hide')

})


signinContainer.querySelector("form").addEventListener("submit" , (e) => {
 e.preventDefault()

  const email = signinContainer.querySelector('#sign-in-email').value
  const password = signinContainer.querySelector('#sign-in-password').value

signInAcc(email,password,loading)

})



addSecBtn.addEventListener('click', () => {
  const inputContainer = document.createElement('div')
  inputContainer.className = 'input'

  inputContainer.innerHTML = `
   <input type="text" class="sectionName" placeholder="section">
              <i class="fa-solid fa-trash-can deleteInput"></i>`

  const closeBtn = inputContainer.querySelector('.deleteInput')

  closeBtn.addEventListener('click', () => {
    inputContainer.remove()
  })

  sectionInputContainer.append(inputContainer)

})




document.querySelector('#sectionDoneBtn').addEventListener('click', (e) => {

  e.preventDefault()
  const classes = {}
  const classNamesEl = document.querySelectorAll('.section-form-container input');

  classNamesEl.forEach((name) => {
    const className = name.value.trim();

    if (className !== '') {
      if (!classes[className]) {
        classes[className] = true;
      }
    }
  })
  storeSecToLeaderboard(classes,loading)
  storeTeacherClasses(classes, loading)
})