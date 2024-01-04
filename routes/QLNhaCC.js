var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query='SELECT * FROM nhacungcap ;';
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query ='SELECT * FROM nhacungcap where manhacungcap= '+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.post('/edit/:id',function(req,res){
    var tennhacungcap= req.body.TenNhaCungCap;
    var sodienthoai= req.body.SoDienThoai;
    var diachi= req.body.DiaChi;
    
    console.log(req.body);
    var query="update nhacungcap set TenNhaCungCap='"+ tennhacungcap+"',SoDienThoai='"+sodienthoai+"',DiaChi='"+diachi+"', updated_at=NOW() where MaKhachHang='"+req.params.id+"'";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});
router.post('/add',function(req,res){
    var tennhacungcap= req.body.TenNhaCungCap;
    var sodienthoai= req.body.SoDienThoai;
    var diachi= req.body.DiaChi;
    
    var query="insert into nhacungcap (TenNhaCungCap,SoDienThoai,DiaChi,created_at) values('"+tennhacungcap+"','"+sodienthoai+"','"+diachi+"',NOW())";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.status(200).json(result);

    });

});
router.delete('/remove/:id',function(req,res){
    console.log(req.params.id);
    var query='delete from khachhang where makhachhang='+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });

});
module.exports = router;
