import { makeAutoObservable } from 'mobx';
import { auth } from './firebase';

const provider = new auth.GoogleAuthProvider();

class Authenticator {
  public userDisplayName = null as string | undefined | null;

  constructor() {
    makeAutoObservable(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  public googleSignIn() {
    auth()
      .signInWithPopup(provider)
      .then((result) => {
        // const credential = result.credential as firebase.default.auth.OAuthCredential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.setUsername(user?.displayName);
        // ...
      }).catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
      });
  }

  private setUsername(name: string | null | undefined) {
    if (!name) throw new Error("Can't set a null or undefined username");
    this.userDisplayName = name;
  }
}

export default Authenticator; 