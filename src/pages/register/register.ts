import { AuthProvider } from '../../providers/auth.provider';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  createSuccess: boolean = false;
  credentials = { email: '', password: '', nickname: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public authProvider: AuthProvider) {
    
  }

  public async register() {

    
    let response = await this.authProvider.registerUser(this.credentials.email, this.credentials.password, this.credentials.nickname);

    if (response.success) {
      this.createSuccess = true;
      this.showPopup("Success", "Account created.");
    } else {
      this.showPopup("Error", response.error + "- Please contact bobby.m.thompson@gmail.com if you need assistance");
    }
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
