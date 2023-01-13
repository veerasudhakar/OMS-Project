import { LightningElement, track, wire } from 'lwc';
import getParentCategory from '@salesforce/apex/productCategoryApex.parentCategories';
export default class ParentCategory extends LightningElement {
/*
    @track pcId;
    @track records;
    @track errorMsg;    
 
    @wire (retrievepcCatRecords, {pcId:'$pccatId'})
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
      this.pccatId = event.detail;
      window.console.log('accountId ' + this.pccatId);
    }*/

    @track getPcId
    @wire(getParentCategory)
    parentCat

    handleChangeRadio(event){        
        this.getPcId = event.target.value;
        window.console.log('getAccId ' + this.getPcId);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getPcId
       });
       this.dispatchEvent(myCustomEventItem);
        
    }



}