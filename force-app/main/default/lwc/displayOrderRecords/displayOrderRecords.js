import { LightningElement,wire,track } from 'lwc';
import retrieveOrderRecords from '@salesforce/apex/cartData.retrieveOrderRecords';
//import retrieveOrderfullRecords from '@salesforce/apex/cartData.retrieveOrderfullRecords';

export default class DisplayOrderRecords extends LightningElement 
{
    @wire (retrieveOrderRecords) ordData;
    @track getordId;
     
    handleChangeRadio(event){        
        this.getordId = event.target.value;
        window.console.log('getordId ' + this.getordId);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getordId
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