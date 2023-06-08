import { isUserSignedIn, isUserATeacher, getTeacherCreatedQuiz } from './db.js'

const links = document.querySelector('.nav-links')
const menuBtn = document.querySelector('.menu')
const loading = document.querySelector('.loading')
/**/

const main = document.querySelector('main')
const p = console.log


menuBtn.addEventListener('click', () => {
  links.classList.toggle('show-nav')
  changeMenuIcon()
})


isUserSignedIn(loading).then((user) => {
  if (user.signedIn) {
    document.querySelector(".signOutBtn").classList.remove('hide')
    document.querySelector(".signinBtn").classList.add('hide')


    const uid = user.uid

    isUserATeacher(uid, loading).then((userIsTeacher) => {
      
      
      if (userIsTeacher) {
        const btnClick = (e) => {
          const quizId = e.target.id;
          
          localStorage.setItem('quiz',JSON.stringify(quizId))
          
          
          
          window.location.href = `playQuiz.html?uid=${uid}`
        };
        
        getTeacherCreatedQuiz(uid, main, btnClick)
      } else {
        /*      For Students  user   */
      }
    })
  } else {
    p('no user')
    window.location.href = '../index.html'
  }

})

links.addEventListener('click', (e) => {
  const link = e.target.textContent.trim()
  redirectUser(link)
})




const changeMenuIcon = () => {
  if (links.className.includes('show-nav')) {
    menuBtn.className = "fa-solid fa-xmark"
  } else {
    menuBtn.className = 'fa-solid fa-bars menu'
  }
}



const redirectUser = (link) => {
  let url = window.location.href


  switch (link) {
    case 'Home':
      url = ``
  }
}