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

User.hasMany(Election, { foreignKey: 'creatorId' });
Election.belongsTo(User, { foreignKey: 'creatorId' });

Election.hasMany(Candidate, { foreignKey: 'electionId' });
Candidate.belongsTo(Election, { foreignKey: 'electionId' });

Election.hasMany(VoterRegistration, { foreignKey: 'electionId' });
VoterRegistration.belongsTo(Election, { foreignKey: 'electionId' });


User.hasMany(VoterRegistration, { foreignKey: 'userId' });
VoterRegistration.belongsTo(User, { foreignKey: 'userId' });


Election.hasOne(Result, { foreignKey: 'electionId' });
Result.belongsTo(Election, { foreignKey: 'electionId' });

export default{
    sequelize,
    User,
    Election,
    Candidate,
    VoterRegistration,
    Result
};
