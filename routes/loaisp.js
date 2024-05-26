var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query='SELECT * FROM loaisanpham ;';
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query ='SELECT * FROM loaisanpham where maloai= '+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.post('/edit/:id',function(req,res){
    var tenloai= req.body.TenLoai;
    console.log(req.body);
    var query="update loaisanpham set tenloai='"+tenloai+"', updated_at=NOW() where MaLoai='"+req.params.id+"'";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});
router.post('/add',function(req,res){
    var tenloai= req.body.TenLoai;
    var query="insert into loaisanpham (TenLoai) values('"+tenloai+"')";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.status(200).json(result);

    });

});
router.delete('/remove/:id',function(req,res){
    console.log(req.params.id);
    var query='delete from loaisanpham where maloai='+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });

});
router.post('/search',function(req,res){
    var keyword= req.body.keyword;
    console.log(keyword);

    var query = `SELECT * FROM loaisanpham
                where TenLoai like '%${keyword}%'`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });
});
module.exports = router;
