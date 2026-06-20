const SearchToolService = require("../Services/SearchTool.service");
const catchAsync = require('../Utils/CatchAsync');

const SearchToolController = {};

// --- Autocomplete ---

SearchToolController.getAutoCompleteAgentId = catchAsync(async (req, res) => {
  const { agentId } = req.body;
  const agentIdSuggest = await SearchToolService.getAutoCompleteAgentId(agentId);
  res.status(200).json(agentIdSuggest);
});

SearchToolController.getAutoCompleteOffice = catchAsync(async (req, res) => {
  const { office, agentId } = req.body;
  const officeSuggest = await SearchToolService.getAutoCompleteOffice(office, agentId);
  res.status(200).json(officeSuggest);
});

SearchToolController.getAutoCompleteAddress = catchAsync(async (req, res) => {
  const { address, agentId } = req.body;
  const addressSuggest = await SearchToolService.getAutoCompleteAddress(address, agentId);
  res.status(200).json(addressSuggest);
});

SearchToolController.getAutoCompleteCity = catchAsync(async (req, res) => {
  const { city, agentId } = req.body;
  const citySuggest = await SearchToolService.getAutoCompleteCity(city, agentId);
  res.status(200).json(citySuggest);
});

SearchToolController.getSearchData = catchAsync(async (req, res) => {
  const { agentId, office, address, city } = req.body;
  const data = await SearchToolService.getSearchData(agentId, office, address, city);
  res.status(200).json(data);
});

// --- Search history / Favorite ---

SearchToolController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await SearchToolService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

SearchToolController.toggleFavorite = catchAsync(async (req, res) => {
  const { search } = req.body;
  await SearchToolService.toggleFavorite(search.idHistory, search.isFavorite);
  res.sendStatus(200);
});

SearchToolController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, agentId, officeName, address, city } = req.body;
  await SearchToolService.saveSearchHistory(userId, savedType, agentId, officeName, address, city);
  res.sendStatus(200);
});

SearchToolController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await SearchToolService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

SearchToolController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await SearchToolService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

module.exports = SearchToolController;
