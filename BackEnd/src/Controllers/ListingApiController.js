const listingService = require('../Services/listingsApiService');
const catchAsync = require('../Utils/CatchAsync');

const ListingApiController = {};

ListingApiController.updateData = catchAsync(async (req, res) => {
  const {
    authToken = 'HVJOXQNIVXKOGOBGLOWU',
    mlsSid,
    status = 'All',
    searchStr = 'All',
    searchBy = 'office',
    fromDate,
    toDate,
    recLimit
  } = req.body.criteria || {};

  const params = {
    authToken,
    mlsSid,
    status,
    searchStr,
    searchBy,
    fromDate,
    toDate,
    recLimit
  };

  const listings = await listingService.fetchDataFromAPI(params);
  await listingService.saveDataToDB(listings);
  res.status(200).json({ message: 'Data updated successfully from API' });
});

ListingApiController.searchListings = catchAsync(async (req, res) => {
  const { first, rows } = req.body.criteria || {};
  const offset = parseInt(first, 10) || 0;
  const limit = parseInt(rows, 10) || 10;

  const totalRecords = await listingService.getTotalRecords();
  const listings = await listingService.getListings(offset, limit);

  res.status(200).json({ listings, totalRecords });
});

ListingApiController.getAutoCompleteOffice = catchAsync(async (req, res) => {
  const { office } = req.body;
  const officeSuggest = await listingService.getAutoCompleteOffice(office);
  res.status(200).json(officeSuggest);
});

ListingApiController.getAutoCompleteAddress = catchAsync(async (req, res) => {
  const { address } = req.body;
  const addressSuggest = await listingService.getAutoCompleteAddress(address);
  res.status(200).json(addressSuggest);
});

ListingApiController.getAutoCompleteCity = catchAsync(async (req, res) => {
  const { city } = req.body;
  const citySuggest = await listingService.getAutoCompleteCity(city);
  res.status(200).json(citySuggest);
});

ListingApiController.getSearchData = catchAsync(async (req, res) => {
  const { office, address, city } = req.body;
  const data = await listingService.getSearchData(office, address, city);
  res.status(200).json(data);
});

ListingApiController.getListingsTop1000 = catchAsync(async (req, res) => {
  const data = await listingService.getListingsTop1000();
  const count = await listingService.getListingsCount();
  res.status(200).json({
    message: `${data.length} records have been recovered from API and ${count} records have been loaded`,
    data
  });
});

module.exports = ListingApiController;
