// Password hashing utility using bcryptjs
import bcrypt from 'bcryptjs'

/**
 * Hash a plain text password
 * @param {string} plainPassword - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (plainPassword) => {
  const saltRounds = 10
  return await bcrypt.hash(plainPassword, saltRounds)
}

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

