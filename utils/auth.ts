import Cookies from 'js-cookie'
import Router from 'next/router'
import { BehaviorSubject } from 'rxjs'

interface Props {
  token: string
  name: string
  email: string
}
const userSubject = new BehaviorSubject(process.browser && JSON.parse(`${localStorage?.getItem("user")}`))

export const userService = {
  user: userSubject.asObservable(),
  get userValue () { return userSubject.value },
  login,
  logout,
  checkRoleAuth
}

function checkRoleAuth(authUser: { role: string }, path: string) {
  const isRoot = authUser.role === "root"
  const isAdmin = authUser.role === "admin"
  const notPermitted = !(isRoot || isAdmin) && path === "/create"

  if(notPermitted) {
    Router.push("/")
  }
}

function login({token, name, email}: Props) {
  Cookies.set("token", token)
  let cookieToken = Cookies.get('token')

  let user = { cookieToken, name, email }
  userSubject.next(user)
  localStorage.setItem("user", JSON.stringify(user))
  
  Router.push('/account')
}

function logout() {
  localStorage.removeItem("user")
  Cookies.remove("token")
  userSubject.next(null)
  // Global logout
  window.localStorage.setItem("logout", Date.now().toString())
  Router.push('/signin')
}