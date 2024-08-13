# Restaurants-List 
透過Node.js建立的伺服器，搭配Express及Handlebars形成的簡易餐廳清單紀錄網頁

## Features
- 透過email註冊會員
- 透過facebook登入
- 指定清單中餐廳排序方式
- 透過關鍵字查詢餐廳
- 檢視餐廳詳細資訊
- 新增餐廳
- 編輯餐廳資訊
- 刪除餐廳

## Version
- v2.2 (24.08.13)
  - 新增登入驗證流程
  - 新增email註冊功能及facebook登入功能
  - 使用環境變數儲存重要資訊
- v2.1 (24.08.01)
  - 重構路由並建立路由模組
  - 優化資料庫處理
  - 新增分頁及操作結果顯示
  - 新增排序功能
- v2.0 (24.07.22)
  - 新增頁面 CRUD 功能
  - 加入 MySQL 資料庫
- v1.0

### Prerequisites
- __[Express](https://www.npmjs.com/package/express)__
- __[Express Handlebars](https://www.npmjs.com/package/express-handlebars)__
- __[MySQL(v8.0.37)](https://www.mysql.com/downloads/)__

### Installation and execution 
1. Clone repo to local 複製專案到本地
``` 
git clone https://github.com/Kriya218/Restaurants-List
```
2. Change directory to Restaurants-List 移動至專案資料夾
``` 
git cd Restaurants-List
```
3. Install npm 安裝 npm 套件
``` 
npm install 
```
4. Run on server 啟動伺服器，點擊URL http://localhost:3000
``` 
npm run dev 
```

### Author
__[Kriya](https://github.com/Kriya218)__
