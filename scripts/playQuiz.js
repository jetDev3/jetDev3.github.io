import { isUserSignedIn, isUserATeacher, getQuiz} from './db.js'
import { createTOF } from './quizzesTemplate/tof.js'

const loading = document.querySelector('.loading')
const playBtn = document.querySelector('.playQuizBtn')

const p = console.log


isUserSignedIn(loading).then((user) => {
  if (user.signedIn) {
    const uid = user.uid
    
     isUserATeacher(uid,loading).then((userIsTeacher) => {
       
       playBtn.addEventListener('click', () => {
         p('clixked playBtn')
       })
       if(userIsTeacher){
         const url = JSON.parse(localStorage.getItem('quiz'))
         getQuiz(url, uid)
           .then((quizzes) => {
             createTOF(quizzes.length)
             
           })
           .catch((error) => {
             // Handle any errors
             console.log('Error retrieving quizzes:', error);
           });
         //For Teacher 
       }
     })

  }
})