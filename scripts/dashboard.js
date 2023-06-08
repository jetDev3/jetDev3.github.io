import { isUserSignedIn, signOutAcc, getQuizLength, getExistingThumbnail } from './db.js'

const links = document.querySelectorAll('.link')
const hamburger = document.querySelector(".menu");
const logOut = document.querySelector('.signOutBtn')
const signIn = document.querySelector('.signinBtn')
const loading = document.querySelector('.loading')
const navMenu = document.querySelector('.nav-links')
const createBtn = document.querySelector('.createQuizBtn')
const createdQuizNumEl = document.querySelector('header .quizNum')
const thumbnailContainer = document.querySelector('.thumbnail-container')

const p = console.log



hamburger.addEventListener('click', () => {
  toggleNav()
  changeMenuIcon()
})
logOut.addEventListener('click', () => {
  signOutAcc(loading)
})


isUserSignedIn(loading)
  .then((result) => {
    if (result.signedIn) {
      /*
      loading.style.display = 'flex'
      const thumbnails = getExistingThumbnail()


      thumbnails.forEach(thumbnail => {
        let image = document.createElement('img')

        image.loading = 'lazy'
        image.src = thumbnail.thumbnailURL
        image.id = thumbnail.id
        thumbnailContainer.append(image)
      })


      loading.style.display = 'none'
*/

      getQuizLength(result.uid, createdQuizNumEl)
      logOut.classList.remove('hide')
      signIn.classList.add('hide')

      createBtn.addEventListener('click', () => {
        window.location.href = `../components/createQuiz.html?uid=${result.uid}`

      })
    }

    links.forEach(btn => {
      btn.addEventListener('click', (e) => {
        let link = e.target.textContent

        if (result.signedIn) {
          console.log('User UID:', result.uid);
          if (link.trim() == 'Home') {
            link = 'index'
            window.location.href = `../${link.trim()}.html?uid=${result.uid}`
          } else {
            window.location.href = ''
            window.location.href = `${link.trim()}.html?uid=${result.uid}`
          }
        } else {
          alert('No user signed in.');

        }
      })
    })

  })



const changeMenuIcon = () => {
  if (navMenu.className.includes('show-nav')) {
    hamburger.className = "fa-solid fa-xmark"
  } else {
    hamburger.className = 'fa-solid fa-bars menu'
  }
}

const toggleNav = () => {
  navMenu.classList.toggle("show-nav");
}