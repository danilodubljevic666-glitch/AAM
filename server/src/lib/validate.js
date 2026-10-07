const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const isEmail = (email) => email.length <= 254 && EMAIL_RE.test(email)
