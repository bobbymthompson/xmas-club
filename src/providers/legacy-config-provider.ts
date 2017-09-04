import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../models/user'
import { Observable } from 'rxjs/Rx';
//import { Config } from '../app/config'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Config {

  constructor() {
  }

  public get(value) {
        var environment:string;
        var data = {};
        environment = window.location.hostname;
        switch (environment) {
            case 'localhost':
                data = {
                    endPoint: 'http://localhost:9000'
                };
                break;
             case 'hccc.herokuapp.com':
                data = {
                    endPoint: 'https://hccc-api.herokuapp.com'
                };
                break;
            default:
                data = {
                    endPoint: 'http://localhost:9000'
                };
        }
        return data[value];
    }
}