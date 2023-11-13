const setData = require("../data/setData")
const themeData = require("../data/themeData")

let sets = []

function initialize() {
    return new Promise((resolve, reject) => {
      sets = [...setData]
      sets.forEach((set) => {
        const themeObj = themeData.find((index) => index.id == set.theme_id)
        const theme = themeObj  ? themeObj.name : ""
        set.theme = theme;
      })
      resolve();
    })
  }
  
function getAllSets() {
    return new Promise((resolve, reject) => {
      resolve(sets)
    })
  }

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find((set) => setNum === set.set_num)
        if(set) {
            resolve(set)
        } else {
            reject("unable to find requested set")
        }
    })
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const filterSets = sets.filter((set) => set.theme.toLowerCase().includes(theme.toLowerCase()))
        if (filterSets) {
            resolve(filterSets)
        } else {
            reject("unable to find requested sets")
        }
    })
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }
