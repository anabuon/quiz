import axios from 'axios'

export default axios.create({
  baseURL:
    'https://react-quiz-b4f1a-default-rtdb.europe-west1.firebasedatabase.app/',
})
