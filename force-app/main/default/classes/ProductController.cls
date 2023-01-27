public with sharing class ProductController 
{
    public ProductController() 
    {

    }
    /*generateCartId is the manual generation of a record id*/
    public static String generateCardId()
    {
        String CharList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
        Integer position;
        Integer LengthRequired = 30;
        String Res = '';
        for(Integer i = 0; i <= LengthRequired; i++) 
        {
            position = Integer.valueof(String.valueof(Math.roundToLong(CharList.length()*Math.random()))) -1;
            Res += CharList.substring(position,position+1);
        }
        return Res;
    }

     @AuraEnabled
    public static OrderWrapper orderDetails(String orderId)
    {
        Orderc__c orderInfo = [
            Select Id, Name, User__c, Shipping_Address__c,subTotal__c,
            Shipping_Address__r.Street__c, Shipping_Address__r.City__c,
            Shipping_Address__r.Country__c,
            Shipping_Address__r.State__c,
            Shipping_Address__r.Postal_Code__c,
            (
                Select Id, Name,
                Producte__r.Name,
                Ordered_Quantity__c,
                Item_Price__c,
                Total_Item_Price__c
                From Order_Items__r
            )
            From Orderc__c
            Where Id =: orderId
        ];
        OrderWrapper wrapper = new OrderWrapper();
        wrapper.order = orderInfo;
        wrapper.Orderitems = orderInfo.Order_Items__r;
        // orderInfo.Order_Items__r => List<Order_Item__c> => null
        return wrapper;
    }
    
    @AuraEnabled
    public static Orderc__c createOrder(String cartId, string addressId, Decimal totalAmount)
    {
        Orderc__c orderInfo = new Orderc__c();
        orderInfo.User__c = UserInfo.getUserId();
        orderInfo.Cart__c = cartId;
        orderInfo.Shipping_Address__c = addressId;
        orderInfo.subTotal__c = totalAmount;
        insert orderInfo; 

        List<Cart_Item__c> cartItems = (List<Cart_Item__c>)JSON.deserialize( getItems(cartId),
                                                                List<Cart_Item__c>.class);

        List<Order_Item__c> orderItems = new List<Order_Item__c>();
        For (Cart_Item__c item : cartItems)
        {
            Order_Item__c oItem = new Order_Item__c();
            oItem.Producte__c = item.Producte__c;
            oItem.Related_Order__c = orderInfo.Id;
            oItem.Ordered_Quantity__c = item.Item_Quantity__c;
            oItem.Item_Price__c = item.Item_Amount__c;
            oItem.Total_Item_Price__c = item.Total_Amount__c;
            orderItems.add(oItem);
        }
        insert orderItems; 

        Cart__c cart = new Cart__c();
        cart.Id = cartId;
        cart.Cart_Status__c = 'Closed';
        cart.IsActive__c = false;
        update cart;

        Orderc__c order = [Select Id, Name From Orderc__c Where Id =:orderInfo.Id];
        return order;
    }

    @AuraEnabled
    public static Address_Book__c saveAddress(String addressDetails)
    {
        // {City__c : '', State__c : ''}
        Address_Book__c addressInfo = (Address_Book__c)JSON.deserialize(addressDetails,
                                                        Address_Book__c.class);
        // Address_Book__c addrs = new Address_Book__c()
        // addrs.City__c = '';
        // addrs.State__c = '';
        // 1 - String whihch contains information in form of Object
        // 2 - Actual Object/Apex Class
        // 3 - (Account)JSON.deserialize(addressDetails,Account.class);
        addressInfo.User__c = UserInfo.getUserId();
        insert addressInfo;
        return addressInfo;
    }

    @AuraEnabled
    public static List<Address_Book__c> addressDetails()
    {
        List<Address_Book__c> addressList = [SELECT Id, City__c, Country__c, 
                                                    Postal_Code__c, State__c, 
                                                    Street__c, User__c 
                                                    FROM Address_Book__c
                                                Where User__c != null 
                                                AND User__c =: UserInfo.getUserId()];
        return addressList;
    }

    @AuraEnabled
    public static string getItems(String cartId)
    {
        List<Cart_Item__c> items = [Select Id, Name, Producte__c, Cart__c, 
                                Item_Quantity__c, Item_Amount__c,
                                Total_Amount__c,
                                Producte__r.Name
                                FROM Cart_Item__c
                                Where Cart__c =: cartId];
        return JSON.serialize(items);
    }

   

    @AuraEnabled
    public static Coupon__c couponInfo(String name)
    {
        Coupon__c Coupon = getCouponInformation(name);
        return Coupon;
    }

    public static Coupon__c getCouponInformation(String name)
    {
        Coupon__c couponRec = [Select Id, Name, 
                                Price__c 
                                FROM Coupon__c 
                                Where Expired__c = false
                                AND (Remaining_Quantity__c > 0 OR Name ='Default')
                                AND Name =: name];
        return couponRec;
    }

    @AuraEnabled
    public static string createCartItems(String CartId, String ProductId, Decimal Amount,Integer Count)
    {
        Cart_Item__c item = new Cart_Item__c();
        Map<Id, Cart_Item__c> cartItemsMap = getCartItems(CartId);
        if ( cartItemsMap.containsKey(ProductId) ) {
            item = cartItemsMap.get(ProductId);
            item.Item_Quantity__c = item.Item_Quantity__c + 1;
            update item;
        } else {
            item.Producte__c = ProductId;
            item.Cart__c = CartId;
            item.Item_Quantity__c = Count;
            item.Item_Amount__c = Amount;
            insert item;
        }
        
        return item.Id;
    }

    public Static Map<Id, Cart_Item__c> getCartItems(String cartId)
    {
        /* ProductId, Cart_Iems*/
        Map<Id, Cart_Item__c> cartItemsMap = new Map<Id, Cart_Item__c>();
        for ( Cart_Item__c cart : [Select Id, Name, Producte__c, Cart__c, 
                                Item_Quantity__c, Item_Amount__c
                                FROM Cart_Item__c
                                Where Cart__c =: cartId]) {
            cartItemsMap.put(cart.Producte__c, cart);
        }
        return cartItemsMap;
    }
    /* */
    @AuraEnabled(cacheable=false)/*cacheable is false because user can use previous coupon data for search*/
    public static string getCartId()
    {
        List<Cart__c> cartInfo = [ Select Id, Name 
                                FROM Cart__c 
                                Where User__c =: UserInfo.getUserId()
                                AND Cart_Status__c = 'Open'
                                AND IsActive__c = true];
        if (cartInfo != null && cartInfo.size() > 0) 
        {
            List<Cart_Item__c> cartItems = new list<Cart_Item__c>();
            cartItems = [Select Id, Name, Producte__c, Cart__c, Item_Quantity__c, Item_Amount__c
                                FROM Cart_Item__c
                                Where Cart__c =: cartInfo.get(0).Id];
            
            Decimal itemQnty = 0;
            for (Cart_Item__c item : cartItems) 
            {
                itemQnty = itemQnty + item.Item_Quantity__c;
            }
            CartWrapper wrapper = new CartWrapper();
            wrapper.CartId = cartInfo.get(0).Id;
            wrapper.items = cartItems;
            wrapper.Count = itemQnty;
            return JSON.serialize(wrapper);
        } 
        else 
        { 
            Cart__c defaultCart = new Cart__c();
            //Coupon__c coupon = getCouponInformation('Default');
            defaultCart.Cart_Id__c = String.valueOf(Math.random());
            defaultCart.Cart_Status__c = 'Open';
            defaultCart.IsActive__c = true;
            defaultCart.Coupon__c ='a0h1s000002RvszAAC';
            defaultCart.User__c = UserInfo.getUserId();
            insert defaultCart;
            CartWrapper wrapper = new CartWrapper();
            wrapper.CartId = defaultCart.Id;
            wrapper.items = null;
            wrapper.Count = 0;
            return JSON.serialize(wrapper);
        }                        
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getProduct(String prdId)
    {
        system.debug('getProductId'+prdId);
        List<Producte__c> pd = [SELECT Id,Name,Image__c,Resource_Url__c,Description__c FROM Producte__c WHERE Id=:prdId];
        return pd;
    }

    @AuraEnabled(cacheable=true)/*Cacheable stores the previous searched results and can easily find the result next time */
    public static List<sObject> searchProduct(String searchParam)
    {
        String likeParam = '%' +searchParam+ '%';
        String Query = '';
        /*
            Select Id, Name From Producte__c Where Name Like '%aa%'
        */
        if(searchParam != null)/*If searchParam parameter is not null,then return/display the products related to the input */
        {
           Query  = 'Select Id, Name, Id__c, Price__c,Image__c,Remaining_Quantity__c,Stock_Status__c, Total_Quantity__c,Resource_Url__c From Producte__c Where Name Like :likeParam LIMIT 50 ';
        }
        else /*If searchParam parameter is null,then return/display all the products*/
        {
           Query  = 'Select Id, Name, Id__c, Price__c,Image__c,Remaining_Quantity__c,Stock_Status__c, Total_Quantity__c,Resource_Url__c From Producte__c LIMIT 50 '; 
        }
        
        List<SObject> sObjectList = Database.query(Query);
        return sObjectList;
    }

    @auraEnabled(cacheable=true)

      public static List<Producte__c> getRelatedCategories(String prdId){

      Producte__c pd =[SELECT Id, Name,Family__c FROM Producte__c WHERE Id=:prdId];

      List<Producte__c> rcList =[SELECT Id, Name,Family__c,Price__c,Resource_Url__c  FROM Producte__c WHERE Family__c=:pd.Family__c AND Id!=:prdId];
       return rcList;

  }

    public class CartWrapper 
    {
        @AuraEnabled
        public String CartId                { get; set; }
        @AuraEnabled
        public Decimal Count                { get; set; }
        @AuraEnabled
        public List<Cart_Item__c> items     { get; set; }
    }

    public class OrderWrapper 
    {
        @AuraEnabled
        public Orderc__c order                     { get; set; }
        @AuraEnabled
        public List<Order_Item__c> Orderitems     { get; set; }
    }
    /*
    @auraEnabled(cacheable=true)
    public static List<Producte__c> getRelatedCategories(String prdId){
        Producte__c pd =[SELECT Id, Name,Family__c FROM Producte__c WHERE Id=:prdId];
         List<Producte__c> rcList =[SELECT Id, Name,Family__c,Price__c,Image__c FROM Producte__c WHERE Family=:pd.Family AND Id!=:prdId];
         return rcList;
        }
        */

        //Related Products Method *Sudhakar*
        @auraEnabled(cacheable=true)
public static List<Producte__c> getRelatedCategories1(String prdId){
    Producte__c pd1 =[SELECT Id, Name,Family__c FROM Producte__c WHERE Id=:prdId];
List<Producte__c> rcList =[SELECT Id, Name,Family__c,Price__c,Resource_Url__c,Image__c FROM Producte__c WHERE Family__c=:pd1.Family__c AND Id!=:prdId];
return rcList;
}
}