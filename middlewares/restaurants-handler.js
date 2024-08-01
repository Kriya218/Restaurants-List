const Op = require('sequelize').Op;

const db = require('../models');
const restaurantList = db.restaurantList;

const restaurantHandler = {};

restaurantHandler.getAll = (req, res, next) => {

  const limit = 9;
  const sort = req.query.sort;
  const currentPage = parseInt(req.query.page) || 1;
  
  // 取得排序條件
  let condition = []
  switch (sort) {
    case 'ASC':
    case 'DESC':
      condition = [[ 'name', sort ]]
      break;
    case 'category':
    case 'location':
      condition = [[ sort ]]
      break;
    case 'rating_DESC':
      condition = [[ 'rating', 'DESC' ]]
      break;
    case 'rating_ASC':
      condition = [[ 'rating', 'ASC' ]]
      break;
  }

  //取得 keyword
  const keywords = req.query.keywords?.replace(/\s+/g, '').toLowerCase();
  const whereCondition = keywords ? {
    [Op.or]: [
      {name: { [Op.like]: `%${keywords}%` }},
      {name_en: { [Op.like]: `%${keywords}%` }},
      {category: { [Op.like]: `%${keywords}%` }},
      {location: { [Op.like]: `%${keywords}%` }},
      {description: { [Op.like]: `%${keywords}%` }},
    ]
  } : {}

  return restaurantList.findAndCountAll({
    attributes: ['id', 'name', 'name_en', 'category','location', 'rating', 'image', 'description'],
    where: whereCondition,
    order: condition,
    offset: (currentPage - 1) * limit,
    limit,
    raw: true
  })    
    .then((restaurantsData) => {
      const dataCount = restaurantsData.count;
      const restaurants = restaurantsData.rows;
      const totalPage = Math.ceil(dataCount / limit);      
      const prevPage = currentPage > 1 ? currentPage - 1 : 1;
      const nextPage = currentPage < totalPage ? currentPage + 1 : totalPage;
      const pages = Array.from({length: totalPage}, (_, i) => i+1);
      
      // 傳回參數
      req.keywords = keywords;
      req.restaurants = restaurants;
      req.prevPage = prevPage;
      req.nextPage = nextPage;
      req.currentPage = currentPage;
      req.pages = pages;
      req.sort = sort;      
      next();

    })
    .catch((error) => {
      error.errorMessage = keywords ? '搜尋失敗' : '資料讀取失敗'
      next(error);
    })
}

restaurantHandler.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    req.restaurant = await restaurantList.findByPk(id, {
    attributes: ['id', 'name', 'category', 'location','phone', 'google_map', 'description', 'image'],
    raw:true});
    next();

  } catch (error) {
    error.errorMessage = '資料讀取失敗';
    next(error);
  }  
}

restaurantHandler.editById = async (req, res, next) => {
  try {
    const id = req.params.id;
    req.restaurant = await restaurantList.findByPk(id, {raw: true});
    next();

  } catch (error) {
    error.errorMessage = '資料讀取失敗';
    next(error);
  }
}

restaurantHandler.update = async(req, res, next) => {
  try {
    const id = req.params.id;
    const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body;
    await restaurantList.update(
      {name, name_en, category, phone, image, location, google_map, rating, description}, {where: {id}});
    req.id = id;
    next();

  } catch (error) {
    error.errorMessage = '更新失敗';
    next(error);
  }
}

restaurantHandler.create = async (req, res, next) => {
  try {
    const {name, name_en, category, phone, image, location, google_map, rating, description} = req.body;
    await restaurantList.create({name, name_en, category, phone, image, location, google_map, rating, description});
    next();
  } catch (error) {
    error.errorMessage = '新增失敗';
    next(error);
  }  
}

restaurantHandler.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('id:', id)
    await restaurantList.destroy({where: {id}});
    next();
  } catch (error) {
    error.errorMessage = '刪除失敗';
    next(error);
  } 
}

module.exports = restaurantHandler;