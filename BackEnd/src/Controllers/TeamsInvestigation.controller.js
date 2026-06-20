const TeamsInvestigationService = require("../Services/TeamsInvestigation.service");
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');

const TeamsInvestigationController = {};

TeamsInvestigationController.getTeamByName = catchAsync(async (req, res) => {
  const term = req.body.term;
  const data = await TeamsInvestigationService.getTeamByName(term);
  console.log(data);
  
  res.status(200).json(data);
});

TeamsInvestigationController.getTeam = catchAsync(async (req, res, next) => {
  const teamId = req.body.teamId;
  const team = await TeamsInvestigationService.getTeam(teamId);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamsInvestigationController.getAgentsByTeamId = catchAsync(async (req, res, next) => {
  const teamId = req.body.teamId;
  const team = await TeamsInvestigationService.getAgentsByTeamId(teamId);
  res.status(200).json(team);
});

TeamsInvestigationController.getTeamByFilter = catchAsync(async (req, res, next) => {
  const teamId = req.body.data.teamId;
  const filterCriteria = req.body.filterCriteria;
  const team = await TeamsInvestigationService.getTeamByFilter(teamId, filterCriteria);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamsInvestigationController.getAgentTeamTable = catchAsync(async (req, res, next) => {  
  const teamId = req.body.data.teamId;
  const filterCriteria = req.body.filterCriteria;
  const teamTableData = await TeamsInvestigationService.getAgentTeamTable(teamId, filterCriteria);
  if (!teamTableData) return next(new AppError('team not found', 404));
  res.status(200).json(teamTableData);
});
// --- Search history ---
TeamsInvestigationController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, teamName, teamId } = req.body;
  await TeamsInvestigationService.saveSearchHistory(userId, savedType, teamName, teamId);
  res.sendStatus(200);
});

TeamsInvestigationController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await TeamsInvestigationService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

TeamsInvestigationController.toggleFavorite = catchAsync(async (req, res) => {
  const { search } = req.body;
  await TeamsInvestigationService.toggleFavorite(search.idHistory, search.isFavorite);
  res.sendStatus(200);
});

TeamsInvestigationController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await TeamsInvestigationService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

TeamsInvestigationController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await TeamsInvestigationService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

TeamsInvestigationController.getTeamInfos = catchAsync(async (req, res, next) => {
 
  const team = await TeamsInvestigationService.getTeamInfos(req.body.teamId);

  res.status(200).json(team);
});




module.exports = TeamsInvestigationController;
