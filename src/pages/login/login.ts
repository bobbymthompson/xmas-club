import { Component } from '@angular/core';
import { AlertController, Loading, LoadingController, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth.provider';
import { Observable } from 'rxjs/Observable';
import { RegisterPage } from "../register/register";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loading: Loading;
  credentials = { email: '', password: '' };

  constructor(private navCtrl: NavController,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) { }

  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }

  public async login() {

    if (this.credentials.email && this.credentials.password) {

      this.showLoading()

      this.authProvider.loginUser(this.credentials.email, this.credentials.password).then(() => {

        this.navCtrl.pop();
      }).catch((error) => {
        
        this.showError('Invalid email or password.')
      });
    }
  }

  public async forgotPassword() {

    if (!this.credentials.email) {
      this.showPopup('Email required', 'Please enter your email address to reset your password');
    } else {
      this.authProvider.forgotPassword(this.credentials.email);
      this.showPopup('Forgot password email sent', 'Please check your email inbox to complete your password reset')
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    alert.present();
  }
}
