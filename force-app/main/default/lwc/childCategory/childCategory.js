import { LightningElement, track, wire } from 'lwc';
import getChildCategories from '@salesforce/apex/productCategoryApex.ChildCategories';
export default class CategoryData extends LightningElement {

    //@wire (retrieveCategoryRecords) catData;
    /*@track getcatId;
     
    handleChangeRadio(event){        
        this.getcatId = event.target.value;
        window.console.log('getcatId ' + this.getcatId);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getcatId
       });
       this.dispatchEvent(myCustomEventItem);
        
    } 

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
    /*
    @track childCatId;
    @track records;
    @track errorMsg;    
 
    @wire (retrieveCategoryRecords, {catId:'$childCatId'})
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
      this.childCatId = event.detail;
      window.console.log('childCatId' + this.childCatId);
    }*/

    
    @track PaccountId;
    @track records;
    @track errorMsg;
    @track getCcId;  
 
    @wire (getChildCategories, {parentId:'$PaccountId'})
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
      this.PaccountId = event.detail;
      window.console.log('PaccountId ' + this.PaccountId);
    }

    handleChangeRadio(event){        
        this.getCcId = event.target.value;
        window.console.log('getAccId ' + this.getCcId);
       const myCustomEventItem = new CustomEvent('myeventdemo',{
            detail: this.getCcId
       });
       this.dispatchEvent(myCustomEventItem);
        
    }
}