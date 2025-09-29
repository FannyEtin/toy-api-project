const toysRoutes = require("./toys");
const usersRoutes = require("./users");

exports.routesInit = (app) => {
  app.use("/toys", toysRoutes);
  app.use("/users", usersRoutes);
};