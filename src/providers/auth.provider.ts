import { Observable, Observer } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { User } from "../models/user";

@Injectable()
export class AuthProvider {
  public user: User;

  constructor(private firebase: AngularFireDatabase, private firebaseAuth: AngularFireAuth) {

    this.onAuthStateChanged().subscribe(user => {
      this.user = user;
    });
  }

  public get isAuthenticated(): boolean {
    return this.user != null;
  }

  public get isAdministrator(): boolean {
    return this.user != null && this.user.nickname == "Striker";
  }

  public onAuthStateChanged(): Observable<User> {

    let that = this;
    return Observable.create(function (observer: Observer<User>) {

      that.firebaseAuth.auth.onAuthStateChanged(user => {

        if (user) {

          that.firebase.object(`/users/${user.uid}`).subscribe(profile => {

            user.nickname = profile.nickname;
            user.favorites = profile.favorites;

            observer.next(user);
          });
        } else {

          observer.next(null);
        }
      });
    });
  }

  public async registerUser(email: string, password: string, nickname: string): Promise<{ success: boolean, error: string }> {

    try {

      let newUser = await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);

      this.firebase.object(`/users/${newUser.uid}/`).set({
        favorites: [],
        nickname: nickname
      });

      let user = await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);

      return new Promise<any>((resolve, reject) => {
        resolve({
          success: true,
          error: ''
        });
      });
    }
    catch (ex) {

      console.log('Error registering user.');
      console.log(ex);

      return new Promise<any>((resolve, reject) => {
        resolve({
          success: false,
          error: ex.message
        });

      });
    }
  }

  public loginUser(email: string, password: string) {

    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public logoutUser() {

    this.firebaseAuth.auth.signOut();
  }

  public forgotPassword(email: any) {
    this.firebaseAuth.auth.sendPasswordResetEmail(email);
  }

  public async loginUserUsingGoogle() {

    // var provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/plus.login');

    // var that = this;

    // return firebase.auth().signInWithPopup(provider).then(function (result) {

    //   if (result.user) {

    //     var user = result.user;

    //     var res = result.user.displayName.split(" ");

    //     // that.userProfile.child(user.uid).set({
    //     //   email: user.email,
    //     //   photo: user.photoURL,
    //     //   username: user.displayName,
    //     //   name: {
    //     //     first: res[0],
    //     //     middle: res[1],
    //     //     last: res[2],
    //     //   },
    //     // });
    //   }

    // }).catch(function (error) {
    //   console.log(error);
    // });
  }
}
