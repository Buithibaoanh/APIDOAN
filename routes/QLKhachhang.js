var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query='SELECT * FROM khachhang ;';
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query ='SELECT * FROM khachhang where makhachhang= '+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.post('/edit/:id',function(req,res){
    var tenkhachhang= req.body.TenKhachHang;
    var sodienthoai= req.body.SoDienThoai;
    var diachi= req.body.DiaChi;
    var email= req.body.Email;
    var anh= req.body.Anh;
    console.log(req.body);
    var query="update khachhang set TenKhachHang='"+ tenkhachhang+"',SoDienThoai='"+sodienthoai+"',DiaChi='"+diachi+"',Email='"+email+"',Anh='"+anh+"', updated_at=NOW() where MaKhachHang='"+req.params.id+"'";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});
router.post('/add',function(req,res){
    var tenkhachhang= req.body.TenKhachHang;
    var sodienthoai= req.body.SoDienThoai;
    var diachi= req.body.DiaChi;
    var email= req.body.Email;
    var anh= req.body.Anh;
    var query="insert into khachhang (TenKhachHang,SoDienThoai,DiaChi,Email,Anh,created_at) values('"+tenkhachhang+"','"+sodienthoai+"','"+diachi+"','"+email+"','"+anh+"',NOW())";
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
