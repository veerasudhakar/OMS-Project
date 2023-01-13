public with sharing class productCategoryApex 
{
@AuraEnabled(cacheable=true)
public static List<Category__c> parentCategories() 
{
    List<Category__c> parentCat = [SELECT Id,Name,Parent_Category__c FROM Category__c WHERE Parent_Category__c ='' ];
    return parentCat;
}
@AuraEnabled(cacheable=true)
public static List<Category__c> ChildCategories(String parentId) 
{
    List<Category__c> catList = new List<Category__c>();
    List<Category__c> childCat =  [SELECT Id,Name,Parent_Category__c FROM Category__c WHERE Parent_Category__c=:parentId ];
    for(Category__c c :childCat)
    {
        catList.add(c);
    }
    return catList;
}
@AuraEnabled(cacheable=true)
public static List<Product_Category__c> productCategory(String childId) 
{
    List<Product_Category__c> pcList = new List<Product_Category__c>();
    List<Product_Category__c> pdCat = [SELECT Id,Name,Category__c,Category__r.Name,Producte__c,Producte__r.Name FROM Product_Category__c WHERE Category__c=:childId ];
    for(Product_Category__c p: pdCat){
        pcList.add(p);
    }
    return pcList;
}
}