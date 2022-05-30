import { LightningElement, api,wire } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions'
import cloturer from "@salesforce/apex/EnqueteQuickActions.cloturer";
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

import { publish, MessageContext } from 'lightning/messageService';
import INFO_SUR_LA_LT_LMS from '@salesforce/messageChannel/lwc383InfosSurLaLtLMS__c';


export default class Sa_Enquete_Transmettre extends LightningElement {
    // replace : /apex/AP315StatutEnqueteCloturer
    //CtrlAP315StatutEnquete.chooseCloturerCall

    @wire(MessageContext) messageContext;
    @api
    get recordId() {
        return this._recordId;
    }
    set recordId(value) {
        this._recordId = value;

        if (this._recordId) {
            this.callApex();
        }
    }

    _recordId;
    isLoading = true;

    callApex() {
        cloturer({ enqueteId: this.recordId})
        .then(() => {
            getRecordNotifyChange([{recordId: this.recordId}]);
            publish(this.messageContext, INFO_SUR_LA_LT_LMS, { caseId: this.recordId});
            this.isLoading=false;
            this.closeAction();
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            this.closeAction();
        });
    }

    closeAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }


}