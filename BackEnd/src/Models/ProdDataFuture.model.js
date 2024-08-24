class ProdDataFuture {
    constructor(MonthName, lastUpdateYEAR,lastUpdateMonth,newListings,existListing,pendingListings,MonthNum) {
        this.MonthName 		=   MonthName ;
        this.lastUpdateYEAR      =   lastUpdateYEAR ;
        this.lastUpdateMonth      =   lastUpdateMonth ;
        this.newListings      =   newListings ;
        this.existListing      =   existListing ;
        this.pendingListings      =   pendingListings ;
        this.MonthNum      =   MonthNum ;

    }
}
module.exports = ProdDataFuture;