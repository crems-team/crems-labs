const TeamService = require("../Services/Team.service");
const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');

const TeamController = {};

TeamController.getTeam = catchAsync(async (req, res, next) => {
  const agentId = req.body.id;
  const team = await TeamService.getTeam(agentId);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamController.getTeamSecondLevel = catchAsync(async (req, res, next) => {
  const agentId = req.body.id;
  const team = await TeamService.getTeamSecondLevel(agentId);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamController.getTeamByFilter = catchAsync(async (req, res, next) => {
  const agentId = req.body.data.id;
  const filterCriteria = req.body.filterCriteria;
  const team = await TeamService.getTeamByFilter(agentId, filterCriteria);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamController.getTeamSecLevelByFilter = catchAsync(async (req, res, next) => {
  const agentId = req.body.data.id;
  const filterCriteria = req.body.filterCriteria;
  const team = await TeamService.getTeamSecLevelByFilter(agentId, filterCriteria);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamController.getTeamTableByFilter = catchAsync(async (req, res, next) => {
  const agentId = req.body.data.id;
  const filterCriteria = req.body.filterCriteria;
  const teamTableData = await TeamService.getTeamTableByFilter(agentId, filterCriteria);
  if (!teamTableData) return next(new AppError('team not found', 404));
  res.status(200).json(teamTableData);
});

//Search Team by name *******************************************************************************************************************************

TeamController.getTeamByName = catchAsync(async (req, res) => {
  const term = req.body.term;
  const data = await TeamService.getTeamByName(term);
  res.status(200).json(data);
});

TeamController.getAgentByTeamName = catchAsync(async (req, res) => {
  const name = req.body.name;
  const loanOfficer = await TeamService.getAgentByTeamName(name);
  res.status(200).json(loanOfficer);
});

TeamController.getTeamInfos = catchAsync(async (req, res, next) => {
 
  const team = await TeamService.getTeamInfos(req.body.name);

  res.status(200).json(//{
    // status: 'success',
    // data: {
      team
    // },
 // }
);
});

TeamController.generateCoryHomeTeamGraph = catchAsync(async (req, res, next) => {
  const teamName = req.body.name;
  const team = await TeamService.generateTeamGraph(teamName);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

TeamController.getAgentTeamTable = catchAsync(async (req, res) => {
  const name = req.body.name;
  const team = await TeamService.getAgentTeamTable(name);
  res.status(200).json(team);
});

// --- Search history ---
TeamController.saveSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType, teamName } = req.body;
  await TeamService.saveSearchHistory(userId, savedType, teamName);
  res.sendStatus(200);
});

TeamController.getSearchHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await TeamService.getSearchHistory(userId, savedType);
  res.status(200).json(data);
});

TeamController.toggleFavorite = catchAsync(async (req, res) => {
  const { search } = req.body;
  await TeamService.toggleFavorite(search.idHistory, search.isFavorite);
  res.sendStatus(200);
});

TeamController.deteteNonFavorite = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  await TeamService.deteteNonFavorite(userId, savedType);
  res.sendStatus(200);
});

TeamController.getFavoriteHistory = catchAsync(async (req, res) => {
  const { userId, savedType } = req.body;
  const data = await TeamService.getFavoriteHistory(userId, savedType);
  res.status(200).json(data);
});

TeamController.getOrgNodesByTeamKey = catchAsync(async (req, res, next) => {
  const teamKey = req.body.name;
  const team = await TeamService.getOrgNodesByTeamKey(teamKey);
  if (!team) return next(new AppError('team not found', 404));
  res.status(200).json(team);
});

module.exports = TeamController;
