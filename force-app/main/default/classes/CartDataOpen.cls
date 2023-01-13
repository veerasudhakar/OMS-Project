public with sharing class CartDataOpen {
    @AuraEnabled(cacheable=true)
    public static List<Cart__c> retrivecardRecords()
    {
        List<Cart__c>cartrec=[SELECT Id, Name, Cart_Status__c, Customer__c, Total_Discount__c FROM Cart__c where Cart_Status__c='Open'];
        return cartrec;
    }
}
