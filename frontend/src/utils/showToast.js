 
import { toast } from 'react-toastify'

const showToast = (msg ) => {
  return toast(msg, {
    position: 'top-center',
    autoClose: 1500,
    hideProgressBar: true,
    progress: 0,
    theme: 'dark',
  })
}

export default showToast
