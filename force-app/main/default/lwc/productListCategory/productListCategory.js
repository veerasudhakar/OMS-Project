import {LightningElement,track,wire } from 'lwc';
import getParentCategory from '@salesforce/apex/productCategoryApex.productCategory'

export default class ProductListCategory extends LightningElement {

    @track accountId;
    @track records;
    @track errorMsg;    
 
    @wire (getParentCategory, {childId:'$accountId'})
      wireConRecord({error,data}){
        if(data){
          this.records = data;     
          this.errorMsg = undefined;    
        }else{         
          this.errorMsg = error;
          this.records = undefined;
        }
      }
 
    handleChangeAction(event){
      this.accountId = event.detail;
      window.console.log('accountId ' + this.accountId);
    }

}