import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Toast } from 'ionic-angular';

/*
 * A service to manage pipe-lined toast requests
 */
@Injectable()
export class ToastService {

    private toastQueue: Array<Toast> = new Array<Toast>();
    private readonly DURATION: number = 3000;

    constructor(private toastCtrl: ToastController) {
    }

    public presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: this.DURATION,
            position: 'top'
        });

        // put on the queue and then process afterwards
        this.toastQueue.push(toast);
        toast.onDidDismiss(() => {
            // if toasts are oustanding presenting them 
            this.processQueue();
        });

        this.processQueue();
    }

    private processQueue() {
        if (this.toastQueue.length > 0) {
            console.log('De-queuing 1 toast of ' + this.toastQueue.length);
            this.toastQueue.pop().present();
        }
    }
}
