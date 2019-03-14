cd src/http-servers/app/db && npx sequelize model:generate --name Product --attributes title:string,description:string,price:float && npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string && npx sequelize seed:generate --name Product1 && npx sequelize seed:generate --name Product2 && npx sequelize seed:generate --name Product3 && npx sequelize seed:generate --name User1 && npx sequelize seed:generate --name User2