'use strict';
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./public/jsons/restaurant.json', 'utf-8')).results 
    await queryInterface.bulkInsert('restaurantList', data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('restaurantList', null);
  }
};
