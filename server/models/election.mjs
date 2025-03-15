/**
 * Defines the 'election' entity in the database.
 *
 * @param {object} sequelize - The Sequelize instance used to define the model.
 * @param {object} DataTypes - A collection of data types supported by Sequelize.
 * @returns {object} A Sequelize model representing the 'election' entity.
 *
 * @property {string} title - The title of the election. This field is required.
 * @property {string} description - A description of the election. This field is optional.
 * @property {Date} startDate - The start date of the election. This field is required.
 * @property {Date} endDate - The end date of the election. This field is required.
 * @property {string} status - The status of the election (e.g., 'draft', 'active', 'closed'). Default is 'draft'.
 * @property {decimal} electionFee - A fee that must be paid in order for the elections to be posted.
 */

export default (sequelize, DataTypes) => {
  return sequelize.define('election', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'active', 'closed']],
      },
    },
    eligibilityType: {
      type: DataTypes.ENUM('all', 'id', 'whitelist'),  // Added 'id' option to match the UI
      allowNull: false,
    },
    anonymousResults: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    realTimeResults: {  
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    electionFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  });
};