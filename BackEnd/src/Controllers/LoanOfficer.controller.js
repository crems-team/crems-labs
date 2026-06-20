const LoanOfficerService = require("../Services/LoanOfficer.service");
const catchAsync = require('../Utils/CatchAsync');

const LoanOfficerController = {};

LoanOfficerController.findLoanOfficerById = catchAsync(async (req, res) => {
  const id = req.body.id;
  const officer = await LoanOfficerService.findLoanOfficerById(id);
  res.status(200).json(officer);
});

LoanOfficerController.getNameLoanOfficer = catchAsync(async (req, res) => {
  const term = req.body.term;
  const data = await LoanOfficerService.getNameLoanOfficer(term);
  res.status(200).json(data);
});

LoanOfficerController.getAgentByName = catchAsync(async (req, res) => {
  const name = req.body.name;
  const loanOfficer = await LoanOfficerService.getAgentByName(name);
  res.status(200).json(loanOfficer);
});

LoanOfficerController.get_SankeyData = catchAsync(async (req, res) => {
  const agentId = req.body.officerId;
  const data = await LoanOfficerService.get_SankeyData(agentId);
  res.status(200).json(data);
});

LoanOfficerController.getTotalAgents = catchAsync(async (req, res) => {
  const officerId = req.body.id;
  const data = await LoanOfficerService.getTotalAgents(officerId);
  res.status(200).json(data);
});

LoanOfficerController.getTotalSalesAndCapRate = catchAsync(async (req, res) => {
  const officerId = req.body.id;
  const data = await LoanOfficerService.getTotalSalesAndCapRate(officerId);
  res.status(200).json(data);
});

// --- Search history ---
LoanOfficerController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, officerName, officerId } = req.body;
  await LoanOfficerService.saveSearchHistory(userId, savedType, officerName, officerId);
  res.sendStatus(200);
});

LoanOfficerController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await LoanOfficerService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

LoanOfficerController.toggleFavorite = catchAsync(async (req, res) => {
  const { search } = req.body;
  await LoanOfficerService.toggleFavorite(search.idHistory, search.isFavorite);
  res.sendStatus(200);
});

LoanOfficerController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await LoanOfficerService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

LoanOfficerController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await LoanOfficerService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

LoanOfficerController.get_agent_ranking_LO = catchAsync(async (req, res) => {
  const { idOfficer, idAgent, officeId } = req.body;
  const data = await LoanOfficerService.get_agent_ranking_LO(idOfficer, idAgent, officeId);
  res.status(200).json(data);
});

LoanOfficerController.getOfficeNamesLo = catchAsync(async (req, res) => {
  const officerId = req.body.id;
  const data = await LoanOfficerService.getOfficeNamesLo(officerId);
  res.status(200).json(data);
});

LoanOfficerController.getDataLOWorkedWithAgent = catchAsync(async (req, res) => {
  const idAgent = req.body.idAgent;
  const data = await LoanOfficerService.getDataLOWorkedWithAgent(idAgent);
  res.status(200).json(data);
});

module.exports = LoanOfficerController;
