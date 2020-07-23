import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import firebase, { auth } from '../firebase'
import { UserContext } from 'contexts'
import SignInAnonymously from 'Components/SignInAnonymously'
import SignInWithGoogle from 'Components/SignInWithGoogle'
import SignInWithTwitter from 'Components/SignInWithTwitter'
import SignInWithFacebook from 'Components/SignInWithFacebook'
import SignInWithGithub from 'Components/SignInWithGithub'
import SignInWithEmailAndPassword from 'Components/SignInWithEmailAndPassword'
import { useSignOut } from 'Components/SignOut'

export const useSignInWithPopup = (provider: firebase.auth.AuthProvider) => {
  const history = useHistory()
  return () =>
    auth
      .signInWithPopup(provider)
      .then(() => {
        history.push('/')
      })
      .catch(error => {
        console.log(error.code)
        console.log(error.message)
        if (error.code === 'auth/account-exists-with-different-credential') {
          signInWithExistCredential(error)
        }
      })
}

export const signInWithExistCredential = async (error: any) => {
  const providers = await auth.fetchSignInMethodsForEmail(error.email)
  const provider = providers[0]
  if (provider === 'password') {
    alert(`${error.email}はすでに認証アカウントが存在します。メールアドレスとパスワードでの認証でログインしてください。`)
  } else {
    alert(`${error.email}はすでに認証アカウントが存在します。以前にお使いの${provider}の認証でログインしてください。`)
  }
}

const SignIn: React.FC = () => {
  const user = useContext(UserContext).user

  if (!user) {
    return (
      <div>
        <h1 className="mb-3 text-center text-xl">ログイン</h1>
        <ul className="text-center">
          <li>
            <SignInAnonymously />
          </li>
          <li>
            <SignInWithGoogle />
          </li>
          <li>
            <SignInWithTwitter />
          </li>
          <li>
            <SignInWithFacebook />
          </li>
          <li>
            <SignInWithGithub />
          </li>
        </ul>
        <div className="mt-4 mb-4 text-sm text-center">または</div>
        <div className="mb-8">
          <SignInWithEmailAndPassword />
        </div>
      </div>
    )
  } else {
    return <LoggedIn />
  }
}

const LoggedIn = () => {
  const signOut = useSignOut
  return (
    <div className="text-center">
      <p>すでにログインしています</p>
      <button className="mt-4 px-4 py-2 text-white bg-black rounded-sm" onClick={signOut()}>
        ログアウト
      </button>
    </div>
  )
}

export default SignIn
