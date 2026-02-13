export const useValidators = () => {
  /**
   * 检查密码是否符合规则：6-15位，数字与字母混合
   * @param {string} password - 要检查的密码
   * @returns {boolean}
   */
  const isValidPassword = (password) => {
    if (!password) return false
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/
    return regex.test(password)
  }

  return {
    isValidPassword,
  }
}
