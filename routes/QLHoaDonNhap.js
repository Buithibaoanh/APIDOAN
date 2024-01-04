var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query='SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, l.TenLoai from sanpham as s inner join loaisanpham as l on s.MaLoai = l.MaLoai ';
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query ='SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, l.TenLoai from sanpham as s inner join loaisanpham as l on s.MaLoai = l.MaLoai where s.MaSanPham='+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.put('/edit/:id',function(req,res){
    var tensanpham= req.body.TenSanPham;
    var maloai= req.body.MaLoai;
    var anh= req.body.Anh;
    var soluong= req.body.SoLuong;
    var mota= req.body.Mota;
    var query="update sanpham set TenSanPham='"+tensanpham+"',MaLoai='"+maloai+"',Anh='"+anh+"',SoLuong='"+soluong+"',Mota='"+mota+"', updated_at=NOW() where MaSanPham= "+req.params.id+"";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});


router.post('/add',function(req,res){
    var tensanpham= req.body.TenSanPham;
    var maloai= req.body.MaLoai;
    var anh= req.body.Anh;
    var soluong= req.body.SoLuong;
    var mota= req.body.Mota;
    var query="insert into sanpham (TenSanPham,MaLoai,Anh,SoLuong,Mota,NgayTao,created_at) values('"+tensanpham+"','"+maloai+"','"+anh+"','"+soluong+"','"+mota+"',NOW(),NOW())";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.status(200).json(result);

    });

});
router.delete('/remove/:id',function(req,res){
    console.log(req.params.id);
    var query='delete from sanpham where MaSanPham='+req.params.id;
    console.log(query);
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });

});
module.exports = router;
