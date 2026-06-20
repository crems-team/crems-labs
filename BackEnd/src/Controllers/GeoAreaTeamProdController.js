const GeoAreaTeamProdService = require("../Services/GeoAreaTeamProd.service");
const catchAsync = require('../Utils/CatchAsync');

const GeoAreaTeamProdController = {};

GeoAreaTeamProdController.getTeamGeoProduction = catchAsync(async (req, res) => {
  const data = await GeoAreaTeamProdService.getTeamGeoProduction(req.body.selectedLocation);
  res.status(200).json(data);
});

GeoAreaTeamProdController.getAgentTeamTable = catchAsync(async (req, res, next) => {  
  const teamId = req.body.data.teamId;
  const teamTableData = await GeoAreaTeamProdService.getAgentTeamTable(teamId);
  if (!teamTableData) return next(new AppError('team not found', 404));
  res.status(200).json(teamTableData);
});


module.exports = GeoAreaTeamProdController;
