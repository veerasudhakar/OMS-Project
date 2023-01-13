import { LightningElement,wire,track } from 'lwc';
import retrivecartRecords from '@salesforce/apex/CartDataOpen.retrivecardRecords';

export default class DisplayCartRecords extends LightningElement 
{
      @wire (retrivecartRecords) cartData;
    @track getcartId;
     
    handleChangeRadio(event){        
        this.getcartId = event.target.value;
        window.console.log('getcartId ' + this.getcartId);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getcartId
       });
       this.dispatchEvent(myCustomEventItem);
        
    }

    @track isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
}