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

    @AuraEnabled
    public Static List<Producte__c> getRecords(String ctg){
        system.debug(ctg);
        set<id> ids = new set<id>();
        for(Product_Category__c pc : [select id, name, Producte__c from Product_Category__c WHERE Category__c =: Ctg]){
            ids.add(pc.Producte__c);
        }
        List<Producte__c> pr = [SELECT Id, Name,Remaining_Quantity__c,Image__c
                             FROM Producte__c Where id =: ids];
        system.debug(pr);
        return pr;
    }
}