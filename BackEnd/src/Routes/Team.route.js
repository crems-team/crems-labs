const express = require('express');

const TeamRouter = express.Router();

const TeamController = require("../Controllers/Team.controller");




TeamRouter.post('/getTeam',TeamController.getTeam);
TeamRouter.post('/getTeamSecondLevel',TeamController.getTeamSecondLevel);
TeamRouter.post('/getTeamByFilter',TeamController.getTeamByFilter);











module.exports = {
    TeamRouter
};