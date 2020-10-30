import Api from '@/services/Api'

// Code below is an example. Not used in code.
export default{
  register (credentials) {
    return Api().post('register', credentials)
  }
}
