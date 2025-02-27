import sequelize from '../config/database.js';
import { DataTypes, DATE } from 'sequelize';
import UserModel from './user.mjs';
import ElectionModel from './election.mjs';
import CandidateModel from './candidate.mjs';
import VoterRegistrationModel from './voterRegistration.mjs';
import ResultsModel from './results.mjs';

const User = UserModel(sequelize, DataTypes);
const Election = ElectionModel(sequelize, DataTypes);
const Candidate = CandidateModel(sequelize, DataTypes);
const VoterRegistration = VoterRegistrationModel(sequelize, DataTypes)
const Results = ResultsModel(sequelize,DataTypes)


export default { 
    sequelize, 
    User, 
    Election, 
    Candidate, 
    VoterRegistration,
    Results
};
