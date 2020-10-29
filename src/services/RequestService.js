import Api from '@/services/Api'

export default{
  register (credentials) {
    return Api().post('register', credentials)
  },
  validate (credentials) {
    return Api().post('validate', credentials)
  },
  verifyToken (token) {
    return Api().post('verifyToken', token)
  },

  vote (vote) {
    return Api().post('vote', vote)
  },
  getVote (user) {
    return Api().post('getVote', user)
  },

  getPicture (user) {
    return Api().post('getPicture', user)
  },
  getAverageGrade (pictureId) {
    return Api().post('getAverageGrade', pictureId)
  }
}
