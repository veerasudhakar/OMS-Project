import { LightningElement ,wire} from 'lwc';
import { CurrentPageReference , NavigationMixin } from 'lightning/navigation';
import getRelatedCat from '@salesforce/apex/ProductController.getRelatedCategories1';

export default class RelatedProducts extends NavigationMixin(LightningElement) {
    //Chnages By Veera Sudhakar
relatedCatg
 productId
@wire(CurrentPageReference)
setCurrentPageReference(currentPageReference) {
this.productId = currentPageReference.state.n__productId;
console.log('current page product => ', this.productId);
console.log('this.productDetail',this.productDetail)

}

@wire(getRelatedCat,{prdId:'$productId'})
  rltData({data,error}){
    if(data){
        console.log('getRealtedData',data)
        this.relatedCatg = data
    }else{
        console.error(error)
     }
     }
}
