/**
 * Defines the 'candidate' entity in the database.
 *
 * @param {object} sequelize - The Sequelize instance used to define the model.
 * @param {object} DataTypes - A collection of data types supported by Sequelize.
 * @returns {object} A Sequelize model representing the 'candidate' entity.
 *
 * @property {string} name - The name of the candidate. This field is required.
 * @property {string} position - The position the candidate is running for. This field is optional.
 * @property {string} description - A description of the candidate. This field is optional.
 */
export default (sequelize, DataTypes) => {
    return sequelize.define('candidate', {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
    });
  };
  