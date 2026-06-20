const GeoAreaAgentProdService = require("../Services/GeoAreaAgentProd.service");
const catchAsync = require('../Utils/CatchAsync');

const GeoAreaAgentProdController = {};

GeoAreaAgentProdController.getAgentGeoProduction = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getAgentGeoProduction(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.searchAgents = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.searchAgents(req.body.selectedLocation, req.body.searchTerm);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getGeoProductionForAgent = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getGeoProductionForAgent(req.body.selectedLocation, req.body.agentId);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getZipsbyCityName = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getZipsbyCityName(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.fetchTransactionsGeoByAgent = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.fetchTransactionsGeoByAgent(req.body.agentId);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getNumberOfAgent = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getNumberOfAgent(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getAgentGeoProductionForExtraction = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getAgentGeoProductionForExtraction(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getTotalTransactionAgent = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getTotalTransactionAgent(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getTotalListingsAgent = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getTotalListingsAgent(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getListingsGeoProduction = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getListingsGeoProduction(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getTotalTransactionForListings = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getTotalTransactionForListings(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getTotalAgentsListings = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getTotalAgentsListings(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getTotalAgentForListing = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getTotalAgentForListing(req.body.selectedLocation);
  res.status(200).json(data);
});

// ------- Search History & Favorite -------- //

GeoAreaAgentProdController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, city, zips, state, county } = req.body;
  await GeoAreaAgentProdService.saveSearchHistory(userId, savedType, city, zips, state, county);
  res.sendStatus(200);
});

GeoAreaAgentProdController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await GeoAreaAgentProdService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

GeoAreaAgentProdController.toggleFavorite = catchAsync(async (req, res) => {
  const { userId, search } = req.body;
  await GeoAreaAgentProdService.toggleFavorite(userId, search.city, search.zips, search.state, search.county, search.isFavorite);
  res.sendStatus(200);
});

GeoAreaAgentProdController.toggleFavoriteTeam = catchAsync(async (req, res) => {
  const { userId, search } = req.body;
  await GeoAreaAgentProdService.toggleFavoriteTeam(userId, search.city, search.zips, search.state, search.county, search.isFavorite);
  res.sendStatus(200);
});

GeoAreaAgentProdController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await GeoAreaAgentProdService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

GeoAreaAgentProdController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await GeoAreaAgentProdService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

GeoAreaAgentProdController.getCitiesByCountyFips = catchAsync(async (req, res) => {
  const { countyFips } = req.body;
  const data = await GeoAreaAgentProdService.getCitiesByCountyFips(countyFips);
  res.status(200).json(data);
});

GeoAreaAgentProdController.getAllCities = catchAsync(async (req, res) => {
  const data = await GeoAreaAgentProdService.getAllCities();
  res.status(200).json(data);
});

GeoAreaAgentProdController.searchZip = catchAsync(async (req, res) => {
  const { term } = req.body;
  const data = await GeoAreaAgentProdService.searchZip(term);
  res.status(200).json(data);
});
     


module.exports = GeoAreaAgentProdController;
