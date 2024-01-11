const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class Sqlite {
  db: any
  constructor() {
    // 创建一个 SQLite 数据库文件
    const dbPath = path.join(app.getPath('userData'), 'jest.pro.db');
    this.db = new sqlite3.Database(dbPath);
    this.db.serialize(() => {
      this.db.run('CREATE TABLE IF NOT EXISTS jest_task (id TEXT, filepath TEXT,  taskdesc TEXT, taskurl TEXT )');
    });
    // db.serialize(() => {
    //   const stmt = db.prepare('INSERT INTO myTable VALUES (?, ?)');
    //   stmt.run('keyff', 'valueff');
    //   stmt.finalize();
    // });
    // db.serialize(() => {
    //   db.each('SELECT key, value FROM myTable', (err, row) => {
    //     console.log(`Key: ${row.key}, Value: ${row.value}`);
    //   });
    // });
  }
  // save(...arg) {
  //   this.db.serialize(() => {
  //     const stmt =  this.db.prepare('INSERT INTO jest_task VALUES (?, ?, ?)');
  //     stmt.run(...arg);
  //     stmt.finalize();
  //   });
  // }
  // 运行sql
  run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, (err) => {
        console.log('run--', err)
        if (err === null) {
          resolve(err);
        } else {
          reject(err);
        }
      });
    });
  }

  all(sql, params = '') {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, data) => {
        // console.log('data---', sql, err, data)
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  // 关闭数据库
  close() {
    this.db.close();
  }
  static getInstance() { 
    if (!Sqlite.instance) {
      Sqlite.instance = new Sqlite()
    }
    return Sqlite.instance
  }
}


// // 创建表
// db.serialize(() => {
//   db.run('CREATE TABLE IF NOT EXISTS myTable (key TEXT, value TEXT)');
// });

// // 插入数据
// db.serialize(() => {
//   const stmt = db.prepare('INSERT INTO myTable VALUES (?, ?)');
//   stmt.run('key', 'value');
//   stmt.finalize();
// });

// // 查询数据
// db.serialize(() => {
//   db.each('SELECT key, value FROM myTable', (err, row) => {
//     console.log(`Key: ${row.key}, Value: ${row.value}`);
//   });
// });

// // 关闭数据库
// db.close();

export default Sqlite