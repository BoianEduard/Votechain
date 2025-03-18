/**
 * Define the 'results' entity in which election results will be stored
 * 
 * @param {object} sequelize - the Sequelize instance used to define the model.
 * @param {object} DataTypes - A collection of the DataTypes supported by Sequelize
 * @returns {object}  - a Sequelize model representing the 'result' entity
 * 
 * @property {string} electionWinner - the winner of the elections.
 * @property {float} voterTurnout - the total turnout of voters' in the elections calculated as a %.
 */

export default (sequelize, DataTypes) => {
    return sequelize.define('result', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      electionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'elections',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      voterTurnout: {
        type: DataTypes.FLOAT, // % de votanți care au participat
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      electionWinner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  };