import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {upload} from './upload.js'


const firebaseConfig = {
  apiKey: "AIzaSyBUXWJW25NNL1pFhU-6Qe6KOhP4s7NxEig",
  authDomain: "fe-upload-aad9e.firebaseapp.com",
  projectId: "fe-upload-aad9e",
  storageBucket: "fe-upload-aad9e.appspot.com",
  messagingSenderId: "708011903052",
  appId: "1:708011903052:web:db049689b0f7be32288ce9"
}
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp)

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const refUp = ref(storage, `images/${file.name}`)
      const task = uploadBytesResumable(refUp, file)

      task.on('state_changed', (snapshot) => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        getDownloadURL(ref(storage, `images/${file.name}`)).then(url => {
          console.log('Download URL', url)
        })
      })
    })
  }
})