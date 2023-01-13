import { LightningElement,track } from 'lwc';

export default class ProductSearch extends LightningElement 
{
    @track searchValue;//bind the property
    handleChange(event)
     {
    const value = event.target.value;//event.target will get you the input
    const searchEvents = new CustomEvent( //created an event so that the search of products is called from parent component
        'simple',
    {
        detail:value
    }
    );
    this.dispatchEvent(searchEvents); //searchEvents is a variable that stores the custom event
    console.log('Event value',value);

    }

}