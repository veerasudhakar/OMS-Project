import { LightningElement,wire,track } from 'lwc';
import retrieveOrderfullRecords from '@salesforce/apex/cartData.retrieveOrderfullRecords';

export default class OrderFullDetails extends LightningElement 
{
    @wire (retrieveOrderfullRecords) ordfullData;
    @track getord1Id;
     
    handleChangeRadio(event){        
        this.getord1Id = event.target.value;
        window.console.log('getord1Id ' + this.getord1Id);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getord1Id
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