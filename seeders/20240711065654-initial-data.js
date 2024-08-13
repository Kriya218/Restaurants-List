'use strict';
const { create } = require('domain');
const fs = require('fs');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction();

      const hashedPassword = await bcrypt.hash('12345678', 10);
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          email: 'user1@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction }
      )
      let data = JSON.parse(fs.readFileSync('./public/jsons/restaurant.json', 'utf-8')).results
      await queryInterface.bulkInsert('restaurantList', data, { transaction });
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
  }
};
