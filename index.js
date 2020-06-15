const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for (i = 0; i < times; i++) {
    result += i + ' ';
  }
  return result;
}

var app=express()
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
  app.get('/cool', (req, res) => res.send(cool()))
  app.get('/times', (req, res) => res.send(showTimes()))
  app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM Person');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  app.post('/adduser',(req,res)=> {
    console.log("post requset for /adduser");
    var name= req.body.uname;
    var size= req.body.usize;
    var height=req.body.uheight;
    var type=req.body.utype;
    var salary=req.body.usalary;
    try {
      console.log("Enter into try");
      const client = await pool.connect();
      //var sql = "INSERT INTO Person VALUES('Divyansh', 12, 170,'A',120000)";


      //const result = await client.query('INSERT INTO Person VALUES(${name},${size},${height},${type},${salary}');
      //console.log(result);

      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
    //res.send(`username: ${name},size: ${size}, height: ${height},type:${type},salary:${salary}`);
    res.send(`Thanks for submitting application`);
  });
  app.get('/users/:id', (req,res)=>{
    console.log(req.params.id);
    res.send("got it");


  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
