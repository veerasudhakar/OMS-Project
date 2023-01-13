import { LightningElement, track, wire} from 'lwc';
import searchProduct from '@salesforce/apex/ProductController.searchProduct';
import cartIco from '@salesforce/resourceUrl/cart888';
import getCartId from '@salesforce/apex/ProductController.getCartId';
import createCartItems from '@salesforce/apex/ProductController.createCartItems';
import getProduct from '@salesforce/apex/ProductController.getProduct'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ProductList extends NavigationMixin(LightningElement) 
{
    @track productRecords; //storing the result
    @track errros; //storing errors
    @track cart888 = cartIco;
    @track cartId;
    @track itemsinCart = 0;
    @track remQnt=''

    connectedCallback(){
        this.defaultCartId();
    } 

    defaultCartId(){
        getCartId()
        .then(data => {
            const wrapper = JSON.parse(data);
            console.log("wrapper",wrapper)
            if ( wrapper ){
                this.itemsinCart = wrapper.Count;
                this.cartId = wrapper.CartId;
            }
        })
        .catch(error => {
            this.cartId = undefined;
            console.log("error",error);
        });
    }

    navigateToCartDetail(){
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Cart_Details' // Cart Detail
            },
            state : {
                c__cartId : this.cartId
            }
        });
    }

    

    addToCart(event)
    {
        const selectProductId = event.detail.productid;
        const qnt = event.detail.qntCount;
         const selectProductRecord = this.productRecords.find(
            record => record.Id === selectProductId
        );
        this.remQnt  = selectProductRecord.Remaining_Quantity__c
        console.log('this.cartId',this.cartId)
        console.log('button Clicked', event.detail.btnname)
        console.log('Product Id', event.detail.productid)
        if(event.detail.btnname ==='product')
        {
            //alert('product Id ev'+ event.detail.productid)
            // getProduct({prdId:event.detail.productid})
            // .then(data => {
            //     console.log('data',data)
            // }).catch(error =>{
            //     console.error(error)
            // });


        }
         if(event.detail.btnname ==='cart')
         {
            
        
       
        // console.log('this.selectProductRecord',selectProductRecord)
        // console.log('this.selectProductId',selectProductId)
        // console.log('this.selectProductRecord',selectProductRecord.Price__c)
        // console.log('this.selectProductRecord',selectProductRecord.Remaining_Quantity__c)
        // this.remQnt  = selectProductRecord.Remaining_Quantity__c
        // console.log('Remaining_Quantity__c', this.remQnt)
        if(this.remQnt>0){

        createCartItems({
            CartId :this.cartId,
            ProductId : selectProductId,
            Amount : selectProductRecord.Price__c,
            Count : qnt
        })
        .then(data => {
            console.log(' Cart Item Id ', data);
            this.itemsinCart = this.itemsinCart + 1;
            const toast = new ShowToastEvent({
                'title' : 'Success!!',
                "message" : selectProductRecord.Name +' Added into Cart!',
                "variant" : "success", 
            });
            this.dispatchEvent(toast);
        })
        .catch(error => {
            console.log(error);
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" : JSON.stringify(error),
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        });
        }else{
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" :selectProductRecord.Name+' Out of Stock',
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        
        }
    }
    }
    
    //this wire method is for displaying some products even the user is not searching
    @wire(searchProduct)
        wiredRecords({error, data})
        {
            
            if ( data ) {
                this.productRecords = data;
                console.log( 'this.productRecords',this.productRecords)
                this.errros = undefined;
            }
            if( error ) {
                this.productRecords = undefined;
                console.log('this.productRecords',this.productRecords)
                this.errros = error;
            }
        }
        //handlesearch imperative way 
        handlesearch(event){  
        searchProduct({
            searchParam:event.detail
        })
        .then(result => {   //promise functions
            
            this.productRecords = result;
            console.log('this.productRecords '+this.productRecords )
           // this.errros = undefined;
        })
        .catch(error => {   //promise functions
            console.log('this.error '+error)
           // this.errros = error;
            this.productRecords = undefined;
        });
    }
    
}