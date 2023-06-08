import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getDatabase, set, ref, push, update, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app)
export const auth = getAuth(app)
const p = console.log


export const signOutAcc = (loading) => {
  loading.style.display = 'flex'
  signOut(auth).then(() => {
    window.location.href = 'index.html'
    loading.style.display = 'none'
    alert('signed out successfully')
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}


export const signInAcc = (email, password, loading) => {
  loading.style.display = 'flex'
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const uid = user.uid
      loading.style.display = 'none'

      window.location.href = `../index.html?uid=${uid}`

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode)
      loading.style.display = 'none'

    });
}


export const createAcc = (email, password, loading) => {
  loading.style.display = 'flex'
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      loading.style.display = 'none'
      // Signed in 
      const user = userCredential.user;
      const uid = user.uid

    })
    .catch((error) => {
      alert(error.message)
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

export const storeUsername = (username, role, loading) => {
  loading.style.display = 'flex'
  onAuthStateChanged(auth, (user) => {

    if (user) {
      const uid = user.uid;
      const usernameRef = ref(getDatabase(), `TeacherList/${uid}/`)
      set(usernameRef, { username, role }).then(() => {
          alert('username stored in Firebase RTDB successfully');
        })
        .catch((error) => {
          alert('Error storing class names in Firebase RTDB:', error);
        });
      loading.style.display = 'none'
    } else {
      // User is signed out
      // ...
    }
  });
}


export const storeTeacherClasses = (classes, loading) => {
  loading.style.display = 'flex'
  onAuthStateChanged(auth, (user) => {
    if (user) {

      const uid = user.uid;
      const classRef = ref(db, `TeacherList/${uid}/Classes`)


      set(classRef, classes).then(() => {
          alert('Class names stored in Firebase RTDB successfully');

          window.location.href = `../index.html?uid=${uid}`
        })
        .catch((error) => {
          alert('Error storing class names in Firebase RTDB:', error);
        });
      loading.style.display = 'none'

    } else {
      // User is signed out
      // ...
    }
  })
}


export function isUserSignedIn(loading) {
  loading.style.display = 'flex'
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      loading.style.display = 'none'
      if (user) {
        // User is signed in
        resolve({ uid: user.uid, signedIn: true });
      } else {
        // No user signed in
        resolve({ uid: null, signedIn: false });
      }
    });
  });
}


export const storeSecToLeaderboard = (sec, loading) => {
  loading.style.display = 'flex'
  let secKeys = Object.keys(sec)
  const leaderboardRef = ref(db, 'Leaderboard/section');
  let objKey, objValue
  const sectList = {}
  onValue(leaderboardRef, (snapshot) => {
    if (snapshot.exists()) {
      let secValue = Object.values(snapshot.val())
      let secLength = secValue.length
      for (let i = 0; i <= secKeys.length - 1; i++) {
        if (secValue.includes(secKeys[i])) {
          p(secKeys[i])
        } else {
          objKey = `${i}`
          objValue = `${secKeys[i]}`
        }
        sectList[objKey] = objValue
      }
      update(leaderboardRef, sectList)


    } else {
      set(leaderboardRef, Object.keys(sec))
    }
  })

  loading.style.display = 'none'
}


export const storeQuizDataOnDb = (quizData, uid, loading, subject, thumbnailUrl, thumbnails) => {
  loading.style.display = 'flex'

  const quizListRef = ref(db, `QuizList/${uid}/${subject}`)

  push(quizListRef, quizData).then((snapshot) => {
      p(thumbnails)
      thumbnails.push({
        id: snapshot.key,
        thumbnailURL: thumbnailUrl
      });

      localStorage.setItem('quizThumbnail', JSON.stringify(thumbnails));

      alert('quizzes stored in db')
      loading.style.display = 'none'


      window.location.href = `Dashboard.html?uid=${uid}`
    })
    .catch((error) => {
      alert('Error storing quizzes in Firebase RTDB:' + error);
    });
}


/*======== Getting Quizzes Length =============*/
export const getQuizLength = (uid, el) => {
  const quizListRef = ref(db, `QuizList/${uid}`)
  let quizCount = 0;

  onValue(quizListRef, (snapshot) => {
    const subjList = snapshot.val()


    // Iterate over each subject
    for (const subject in subjList) {
      if (subjList.hasOwnProperty(subject)) {

        quizCount += Object.keys(subjList[subject]).length;
      }
    }

    el.textContent = quizCount
  })
}


export const getExistingThumbnail = () => {
  return JSON.parse(localStorage.getItem('quizThumbnail')) || []
}


/*======= Checking User Role =========*/
export const isUserATeacher = (uid, loading) => {
  loading.style.display = 'flex'

  const teacherRef = ref(db, `TeacherList/${uid}`);

  return new Promise((resolve, reject) => {
    onValue(teacherRef, (snapshot) => {
      if (snapshot.exists()) {
        loading.style.display = 'none'
        resolve(true);
      } else {
        loading.style.display = 'none'
        resolve(false);
      }
    }, (error) => {
      loading.style.display = 'none'
      reject(error);
    });
  });
};


export const getTeacherCreatedQuiz = (uid, parentEl, func) => {
  return new Promise((resolve, reject) => {
    const quizRef = ref(db, `QuizList/${uid}`);

    onValue(quizRef, (snapshot) => {
      const quizList = snapshot.val();

      if (!quizList) {
        const noQuizMessage = document.createElement('h1');
        noQuizMessage.textContent = 'There are no quizzes yet.';
        parentEl.append(noQuizMessage);
        resolve();
        return;
      }

      for (const subject in quizList) {
        const quizzes = quizList[subject];
        const containerEl = document.createElement('div');
        const thumbnailContainer = document.createElement('div');

        thumbnailContainer.className = 'quiz-container';
        containerEl.className = 'container';

        containerEl.innerHTML = `
          <div class="txt-container">
            <h3 class="subj-name">${subject}</h3>
          </div>
        `;
        let thumbnailCount = 0
        for (const quizId in quizzes) {
          if (thumbnailCount > 5) {
            break
          }
          const imgContainer = document.createElement('div');
          imgContainer.className = 'img-container';
          imgContainer.innerHTML = `
            <img src="../images/math.jpg" alt="">
            <button class="playBtn" id=${subject}/${quizId}>Maglaro!</button>
          `;
          imgContainer.querySelector('.playBtn').addEventListener('click', func);

          thumbnailContainer.append(imgContainer);
        }

        containerEl.append(thumbnailContainer);
        parentEl.append(containerEl);
      }

      resolve(); 
    }, (error) => {
      reject(error); 
    });
  });
};


export const getQuiz = (url, uid) => {
  return new Promise((resolve, reject) => {
    const quizRef = ref(db, `QuizList/${uid}/${url}`);

    onValue(quizRef, (snapshot) => {
      const quizzes = snapshot.val();
      resolve(quizzes);
    }, (error) => {
      reject(error);
    });
  });
};