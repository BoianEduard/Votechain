import sequelize from '../config/database.mjs';
import { DataTypes, UUIDV4 } from 'sequelize';
import UserModel from './user.mjs';
import ElectionModel from './election.mjs';
import CandidateModel from './candidate.mjs';
import VoterRegistrationModel from './voterRegistration.mjs';
import ResultsModel from './result.mjs';

const User = UserModel(sequelize, DataTypes, UUIDV4);
const Election = ElectionModel(sequelize, DataTypes);
const Candidate = CandidateModel(sequelize, DataTypes, UUIDV4);
const VoterRegistration = VoterRegistrationModel(sequelize, DataTypes);
const Result = ResultsModel(sequelize, DataTypes);


export default{
    sequelize,
    User,
    Election,
    Candidate,
    VoterRegistration,
    Result
};
