public with sharing class productList {
    @AuraEnabled(cacheable=true)
    public Static List<Category__c> getCtg(){

        return [SELECT Id, Name FROM Category__c WHERE Parent_Category__c = NULL];
    }

    @AuraEnabled(cacheable=true)
    public Static List<Category__c> getSubCat(String subCat){
        system.debug(subCat);
        return [SELECT Id, Name FROM Category__c WHERE Parent_Category__c =: subCat];
    }
    
    //Changes by sudhakar
    @AuraEnabled(cacheable=true)
    public Static List<Category__c> getpcproducts(String catid){
        SET<Category__c> subC = [SELECT Id FROM Category__c WHERE Parent_Category__c IN: catid];
        List<Product_Category__c> pcList = [SELECT id, Producte__r.Id FROM Product_Category__c WHERE Category__c IN: subC ];
        Set<Id> ids = new Set<Id>();
        for(Product_Category__c pc : pcList){
            ids.add(pc.Producte__r.Id);
        }
        return [Select Id, Name, Id__c, Price__c,Image__c,Remaining_Quantity__c,Stock_Status__c, Total_Quantity__c,Resource_Url__c From Producte__c Where id =: ids];
    }
    


    @AuraEnabled
    public Static List<Producte__c> getRecords(String ctg){
        system.debug(ctg);
        set<id> ids = new set<id>();
        for(Product_Category__c pc : [select id, name, Producte__c from Product_Category__c WHERE Category__c =: Ctg]){
            ids.add(pc.Producte__c);
        }
        List<Producte__c> pr = [Select Id, Name, Id__c, Price__c,Image__c,Remaining_Quantity__c,Stock_Status__c, Total_Quantity__c,Resource_Url__c From Producte__c Where id =: ids];
        system.debug(pr);
        return pr;
    }

    @AuraEnabled(cacheable=true)
public static List<Producte__c> getProductsDetails2(Decimal minpriceValue,Decimal maxpriceValue,String childId){
    //system.debug('priceValue '+priceValue);
    System.debug('childId '+childId);
    System.debug('minpriceValue '+minpriceValue);
    System.debug('maxpriceValue '+maxpriceValue);
    set<Id> ids = new set<Id>();
    List<Product_Category__c> pdCat = [SELECT Id,Name,Category__c,Category__r.Name,Producte__c,Producte__r.Name,Producte__r.Price__c FROM Product_Category__c WHERE Category__c =:childId AND Producte__r.Price__c <=:maxpriceValue  AND Producte__r.Price__c >=:minpriceValue];
    for(Product_Category__c p: pdCat){
        ids.add(p.Producte__c);
    }
        if(minpriceValue >=0 && maxpriceValue !=0){
        List<Producte__c> pdList2 =[SELECT Id,Name,Remaining_Quantity__c,Stock_Status__c,Description__c,Price__c,Image__c,Resource_Url__c,
         (SELECT Id,Category__c FROM Product_Categories__r) 
         FROM Producte__c WHERE Id IN:ids ORDER BY Name ASC];
         return pdList2;
            }
            return null;
}
}