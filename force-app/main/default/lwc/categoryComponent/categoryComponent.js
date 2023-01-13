import { LightningElement, track, wire, api } from 'lwc';

import getCtg from '@salesforce/apex/productList.getCtg';

import getSubCat from '@salesforce/apex/productList.getSubCat';

import getRecords from '@salesforce/apex/productList.getRecords';

 

let i= 0;

export default class CategoryComponent extends LightningElement {

    @track items = [];

    @track value = '';



    @track items2 = [];

    @track value2 = '';

 

 

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



    }

    

    

    get roleOptions2() {

        return this.items2;

    }


productImages
    handleChange2(event) {

        const selectedOption = event.detail.value;

        console.log('selected Sub Category =' + selectedOption);




        getRecords({ ctg: event.detail.value })

            .then(result => {
                console.log('result',result)
                this.productImages=result
            }).catch(error=>{
                console.log('error',error)
            })
        }

                

}