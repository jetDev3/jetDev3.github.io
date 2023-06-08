import { isUserSignedIn, signOutAcc } from './scripts/db.js'
const hamburger = document.querySelector(".menu");
const navMenu = document.querySelector('.nav-links')
const links = document.querySelectorAll('.link')
const loading = document.querySelector('.loading')
const modal = document.querySelector('.modal-container')
const btnLinks = document.querySelectorAll('.btnLink')
const logOut = document.querySelector('.signOutBtn')
const signIn = document.querySelector('.signinBtn')

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
      
      
      logOut.classList.remove('hide')
      signIn.classList.add('hide')

    }
    links.forEach(btn => {
      btn.addEventListener('click', (e) => {
        let link = e.target.textContent

        if (result.signedIn) {
          console.log('User UID:', result.uid);
          if (link.trim() == 'Home') {
            link = 'index'
            window.location.href = `${link.trim()}.html?uid=${result.uid}`
          } else {
            window.location.href = ''
            window.location.href = `components/${link.trim()}.html?uid=${result.uid}`
          }
        } else {
          console.log('No user signed in.');
          showModal()
        }
      })
    })
    btnLinks.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const link = e.target.textContent
          .trim()
        if (result.signedIn) {
            
            window.location.href = `components/Quiz.html?uid=${result.uid}`
          
        } else {
          showModal()
        }
      })
    })
  })
  .catch((error) => {
    console.log('Error:', error);
  });





modal.addEventListener('click', (e) => {
  const targetEl = e.target.textContent

  if (targetEl.trim() == 'Teacher') {
    window.location.href = 'components/login.html'
  }


  modal.style.transform = 'translateY(-200%)';

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

const showModal = () => {
  modal.style.transform = 'translateY(0%)';
}