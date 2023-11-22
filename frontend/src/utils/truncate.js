export const truncate = (text, limit = 140) => {
    
    return text.substring(0, limit) + '...'
  }
  