const OfficeService = require("../Services/Office.service");
const catchAsync = require('../Utils/CatchAsync');

const OfficeController = {};

OfficeController.getCity = catchAsync(async (req, res) => {
  const term = req.query.term;
  const city = await OfficeService.getCity(term);
  res.status(200).json(city);
});

OfficeController.getOfficeByCity = catchAsync(async (req, res) => {
  const officeName = req.query.term;
  const city = req.query.city;
  const officesSugges = await OfficeService.getOfficeByCity(city, officeName);
  res.status(200).json(officesSugges);
});

OfficeController.getAgentsByOffice = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const data = await OfficeService.getAgentByOffice(officeId);
  res.status(200).json(data);
});

OfficeController.findOfficeById = catchAsync(async (req, res) => {
  const agentId = req.body.id;
  const office = await OfficeService.findOfficeById(agentId);
  res.status(200).json(office);
});

// --- Search history ---
OfficeController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, officeName, officeId, officeState } = req.body;
  await OfficeService.saveSearchHistory(userId, savedType, officeName, officeId, officeState);
  res.sendStatus(200);
});

OfficeController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await OfficeService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

OfficeController.toggleFavorite = catchAsync(async (req, res) => {
  const { userId, search } = req.body;
  await OfficeService.toggleFavorite(userId, search.officeName, search.officeId, search.isFavorite);
  res.sendStatus(200);
});

OfficeController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await OfficeService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

OfficeController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await OfficeService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

// --- Metrics / Stats ---
OfficeController.get_total_past_Office = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_total_past_Office(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_histo_data_office = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_histo_data(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_Data_Present_Report = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_Office_Data_Present_Report(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_Present_Metrics = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_Office_Present_Metrics(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_NbrAgents = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const nbrAgents = await OfficeService.get_Office_NbrAgents(officeId);
  res.status(200).json(nbrAgents);
});

OfficeController.get_geo_data_tot10 = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_geo_data_tot10(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_Data_Geo_Report = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_Office_Data_Geo_Report(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_office_production = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_office_production(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_Ranking_Report = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_Office_Ranking_Report(officeId);
  res.status(200).json(officeData);
});

OfficeController.get_Office_Top_Cities = catchAsync(async (req, res) => {
  const officeId = req.body.id;
  const officeData = await OfficeService.get_Office_Top_Cities(officeId);
  res.status(200).json(officeData);
});

module.exports = OfficeController;
