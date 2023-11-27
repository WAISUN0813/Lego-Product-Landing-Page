require("dotenv").config();
const Sequelize = require("sequelize");

let sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

const Set = sequelize.define(
  "Set",
  {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Theme = sequelize.define(
  "Theme",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // use "project_id" as a primary key
      autoIncrement: true, // automatically increment the value
    },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Set.belongsTo(Theme, { foreignKey: "theme_id" });

// const setData = require("../data/setData");
// const themeData = require("../data/themeData");

// let sets = [];

function initialize() {
  return new Promise(async (resolve, reject) => {
    // sets = [...setData];
    // sets.forEach((element) => {
    //   const found = themeData.find((index) => index.id == element.theme_id);
    //   let theme = found ? found.name : "";
    //   element.theme = theme;
    // });
    // resolve();
    try {
      await sequelize.sync();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
    Set.findAll({ include: [Theme] })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject("Unable to find sets");
      });
  });
}
function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [Theme],
      where: { "$Theme.name$": { [Sequelize.Op.iLike]: `%${theme}%` } },
    })
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      }).catch((err) => {
        console.log(err);
        reject("Unable to find requested sets");
      });
  });
}

function getSetByNum(setNum) {
  return new Promise(async (resolve, reject) => {
    try {
      let found = await Set.findOne({
        where: { set_num: setNum },
        include: [Theme],
      });

      if (found) {
        resolve(found);
      } else {
        reject("Unable to find requested set");
      }
    } catch (error) {
      console.error(error);
      reject("An error occurred");
    }
  });
}

function addSet(setData) {
  return new Promise(async (resolve, reject) => {
    try {
      let newSet = await Set.create(setData);
      resolve(newSet);
    } catch (err) {
      console.error(err);
      reject("set_num must be unique");
    }
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject("Unable to find themes");
      });
  });
}

function editSet(set_num, setData) {
  return new Promise((resolve, reject) => {
    getSetByNum(set_num)
      .then(foundSet => {
        if (!foundSet) {
          return reject('Set not found');
        }
        return foundSet.update(setData)
        .then(resolve)
        .catch(reject);
      })
      .catch(err => {
        console.error(err);
        reject(err.message);
      });
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    getSetByNum(set_num)
      .then(setToDelete => {
        if (!setToDelete) {
          return reject("Set not found");
        }
        return setToDelete.destroy()
        .then(resolve)
        .catch(reject);
      })
      .catch(err => {
        console.error(err);
        reject(err.message);
      });
  });
}

module.exports = {
  initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet,
};

