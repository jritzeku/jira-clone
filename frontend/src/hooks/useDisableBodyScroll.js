import { useEffect } from 'react'

import React from 'react'
const useDisableBodyScroll = (open) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [open])

  return <div></div>
}

export default useDisableBodyScroll
