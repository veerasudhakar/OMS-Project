import { LightningElement,api,track,wire } from 'lwc';
//import { CurrentPageReference , NavigationMixin } from 'lightning/navigation';
//import searchProduct from '@salesforce/apex/ProductController.searchProduct'
import getProduct from '@salesforce/apex/ProductController.getProduct'
import getRelatedCategories from '@salesforce/apex/ProductController.getRelatedCategories'
import { NavigationMixin } from 'lightning/navigation';

export default class ProductTile extends NavigationMixin(LightningElement)
{
    @api productRecord; //this api property is used for storing product records and can be called publicly
    productDetail=[]

    @track productId

    @track sourceUrl

    //@track unitPrice

    image1

    image2

    image3

    recordId

    // @wire(getProduct,{prdId:'$productId'})

    // prdImg({data,error}){
    //     if(data)
    //     {
    //         this.productDetail = data

    //         this.sourceUrl = data[0].Resource_Url__c

    //         //this.unitPrice = data[0].Product__r.Price__c

    //         //this.remainingQty = data[0].Product__r.RemainingQuantity__c

    //         this.image1=`${data[0].Resource_Url__c}image1.png`

    //         this.image2=`${data[0].Resource_Url__c}image2.png`

    //         this.image3=`${data[0].Resource_Url__c}image3.png`

    //         console.log('imgSrc : '+data[0].Resource_Url__c)
    //         console.log('imgSrc url : '+data[0].Resource_Url__c+'image1.png')
    //         console.log('imgSrc : '+data[0].Resource_Url__c)
    //         console.log('imgSrc : '+data[0].Resource_Url__c)
    //         console.log('data',data)
    //         //console.log('unitPrice',data[0].Producte__r.Price__c)
    //     }
    //     else if(error)
    //     {
    //         console.error('error',error)
    //     }
    // }

    count=1

    IncClick(){

     this.count=this.count+1

    }

    DecClick(){

     if(this.count>1)

         this.count=this.count-1

    }

    @track isShowModal = false;

    showModalBox() 
    {  
        console.log(this.productRecord.Id)
        //alert('ProductId'+this.productRecord.Id)
        getProduct({prdId:this.productRecord.Id})
        .then(data => {
        console.log('data',data)
        this.productDetail = data
        //console.log('button clicked',event.target.name)
    this.sourceUrl = data[0].Resource_Url__c
    this.image1=`${data[0].Resource_Url__c}image1.png`
    this.image2=`${data[0].Resource_Url__c}image2.png`
    this.image3=`${data[0].Resource_Url__c}image3.png`

    console.log('image1 : '+this.image1)
    console.log('image2 : '+this.image2)
    console.log('image3 : '+this.image3)
        }).catch(error =>{
        console.error(error)
        });

        this.isShowModal = true;
    }

    hideModalBox() 
    {  
        this.isShowModal = false;
    }

    

    /*@track product = {
        images: [
          { url: '/image1.jpg', index: 0 },
          { url: '/image2.jpg', index: 1 },
          { url: '/image3.jpg', index: 2 },
        ],
      };

    selectImage(event) 
    {
        const index = event.currentTarget.dataset.index;
        this.template.querySelector('lightning-carousel').setCurrentSlide(index);     
    }*/
   
    handleAddToCart(event)
    {
    const addToCart = new CustomEvent('cart',
    {
    detail:{
     productid:this.productRecord.Id,
     btnname:event.target.name,
     qntCount:this.count
    }
    });
    this.dispatchEvent(addToCart);

    console.log('count ',this.count)
    
    //console.log('imgSrc : '+data[0].Resource_Url__c)
    }

    navigateToRelatedPrd()
    {
        getRelatedCategories({prdId:this.productRecord.Id})
        .then(data => {
            console.log(' product related ', data);
            
        })
        .catch(error => {
            console.log(error);
        
        });
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                objectApiName: 'Related_Product_Details',
                state:{
                       c__productId:this.productId
                      }
            }
        })
    }
}