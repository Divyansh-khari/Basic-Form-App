const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;


var app=express()
  app.use(express.json());
  app.use(express.urlencoded({extended:false}));
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
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
  app.post('/adduser',async (req,res)=> {
    console.log("post requset for /adduser");
    var name= req.body.uname;
    var size= req.body.usize;
    var height=req.body.uheight;
    var type=req.body.utype;
    var salary=req.body.usalary;
    try {
      console.log("Enter into try");
      const client = await pool.connect();
      var sql = 'INSERT INTO Person VALUES(name,size,height,type,salary)'';


       const result = await client.query(sql);


      //console.log(result);

      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
    res.send(`username: ${name},size: ${size}, height: ${height},type:${type},salary:${salary}`);
    res.send(`Thanks for submitting application`);
  });
  app.get('/users/:id', (req,res)=>{
    console.log(req.params.id);
    res.send("got it");


  });
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
