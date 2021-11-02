import Sequelize from 'sequelize';
import path from 'path';
 
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

console.log(__dirname);
 
const models = {
  User: require(path.join(__dirname, './user.js'))(sequelize, Sequelize.DataTypes),
  Message: require(path.join(__dirname, './message.js'))(sequelize, Sequelize.DataTypes),
};
 
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});
 
export { sequelize };
 
export default models;