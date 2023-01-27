import { LightningElement, track, wire,api} from 'lwc';
import searchProduct from '@salesforce/apex/ProductController.searchProduct';
import cartIco from '@salesforce/resourceUrl/cart888';
import getCartId from '@salesforce/apex/ProductController.getCartId';
import createCartItems from '@salesforce/apex/ProductController.createCartItems';
import getProduct from '@salesforce/apex/ProductController.getProduct'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getCtg from '@salesforce/apex/productList.getCtg';

import getSubCat from '@salesforce/apex/productList.getSubCat';
import getpcproducts from '@salesforce/apex/productList.getpcproducts';

import getRecords from '@salesforce/apex/productList.getRecords';
import getProdDetails2 from '@salesforce/apex/productList.getProductsDetails2';

 

let i= 0;

export default class ProductList extends NavigationMixin(LightningElement) 
{
    @track chosenvalue2 =''
    @track productRecords; //storing the result
    @track errros; //storing errors
    @track cart888 = cartIco;
    @track cartId;
    @track itemsinCart = 0;
    @track remQnt=''
    isAllData=true
    catData= false
    @track items = [];

    @track value = '';

    @track items2 = [];

    @track value2 = '';
    @track product3
    priceData=false



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

    //clear filter
    clearFilter(event)
    {
        this.isAllData = true;
        this.template.querySelectorAll('lightning-combobox').forEach(each=>{each.value =undefined;});
        
    }

    @wire(getCtg)

    catRecs({ error, data }) {

        if (data) {

            for (i = 0; i < data.length; i++) {

                this.items = [...this.items, { value: data[i].Id, label: data[i].Name }];

            }

            this.catgr = data;

            this.error = undefined;

        } else if (error) {

            this.error = error;

            this.categories = undefined;

        }

    }



    get roleOptions() {

        return this.items;

    }

    



    handleChange(event) {

        console.log('selected value=' + event.detail.value);

        this.items2 = '';

        getSubCat({ subCat: event.detail.value })

            .then((data) => {

                if (data) {

                    for (i = 0; i < data.length; i++) {

                        this.items2 = [...this.items2, { value: data[i].Id, label: data[i].Name }];

                    }

                    this.error = undefined;

                } else if (error) {

                    this.error = error;

                    this.categories = undefined;

                }

                //eval("$A.get('e.force:refreshView').fire();");

            })




            getpcproducts({ catid: event.detail.value })

            .then((data) => {

                if (data) {
                    this.isAllData=false
                this.catData=true
                    this.productImages=data;
                    this.error = undefined;

                } else if (error) {

                    this.error = error;

                    this.categories = undefined;

                }

                //eval("$A.get('e.force:refreshView').fire();");

            })



    }

    

    

    get roleOptions2() {

        return this.items2;

    }


    productImages
    handleChange2(event) {

        const selectedOption = event.detail.value;

        console.log('selected Sub Category =' + selectedOption);

    this.chosenvalue2= selectedOption

    console.log(' this.chosenvalue2 =' + this.chosenvalue2);
        getRecords({ ctg: event.detail.value })

            .then(result => {
                this.isAllData=false
                this.catData=true
                console.log('result',result)
                this.productImages=result
            }).catch(error=>{
                console.log('error',error)
            })
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
        if(this.remQnt>=qnt){

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
                this.isAllData=true
                this.catData=false
                this.priceData=false
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
            this.isAllData=true
                this.catData=false
                this.priceData=true
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

    maxHandleAmountChange(event){
       
        this.maxValue=event.target.value
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
           
                console.log('maxValue',this.maxValue)
            
        
        },1000)
     
    }
    minHandleAmountChange(event){
        this.minValue=event.target.value
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
       
        console.log('minValue',this.minValue)
        },1000)
    }

    applyPriceHandler(){
        //if(this.maxValue > this.minValue){
console.log('chosenvalue2inapplyPriceHandler',this.chosenvalue2)
            getProdDetails2({minpriceValue:this.minValue,maxpriceValue: this.maxValue,childId:this.chosenValue2 })
        .then(data=>{
            this.isAllData=false
            this.priceData=true
            this.catData=false
             this.product3=data
            console.log('price data',data)
        }).catch(error=>{
            console.error(error)
        })
    //}else{
        //this.error='max pirce greater than min price'
    //}
    }
    
}