const express = require('express');

const TeamRouter = express.Router();

const TeamController = require("../Controllers/Team.controller");




TeamRouter.post('/getTeam',TeamController.getTeam);










module.exports = {
    TeamRouter
};