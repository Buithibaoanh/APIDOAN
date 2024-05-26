var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query = `Select k.TenKho, k.DiaChi, k.created_at, k.updated_at, k.MaKho
                from kho as k`;
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query = `Select c.SoLuong as SoLuongNhap, s.TenSanPham, l.TenLoai, s.Anh,
                s.SoLuong as SoLuongHienTai, g.Gia, (c.SoLuong * g.Gia) as Total
                from kho as k
                inner join chitietkho as c on c.MaKho = k.MaKho
                inner join sanpham as s on s.MaSanPham = c.MaSanPham
                inner join loaisanpham as l on s.MaLoai = l.MaLoai
                inner join giaban as g on s.MaSanPham = g.MaSanPham
                where k.MaKho = '${req.params.id}';`
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.post('/edit/:id',function(req,res){
    var TenKho= req.body.TenKho;
    var DiaChi= req.body.DiaChi;
    
    console.log(req.body);
    var query="update kho set TenKho='"+ TenKho+"',DiaChi='"+DiaChi+"', updated_at=NOW() where MaKho='"+req.params.id+"'";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});
router.post('/add',function(req,res){
    var TenKho= req.body.TenKho;
    var DiaChi= req.body.DiaChi;
    
    var query="insert into kho (TenKho,DiaChi,created_at, updated_at) values('"+TenKho+"','"+DiaChi+"',NOW(), NOW())";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        return res.status(200).json(result);
    });

});
router.delete('/remove/:id',function(req,res){
    console.log(req.params.id);
    var query='delete from kho where MaKho='+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });

});

router.post('/Them',function(req,res){
    var MaKho = req.body.MaKho;
    var MaSanPham = req.body.MaSanPham;
    var SoLuong = req.body.SoLuong;
    var Gia = 0;

    var query1 = `select g.Gia
                from sanpham as s
                inner join giaban as g on g.MaSanPham = s.MaSanPham
                where s.MaSanPham = ${MaSanPham}`;
    db.query(query1,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        Gia = result[0].Gia;
        let query2 = `Insert into chitietkho (MaSanPham, MaKho, SoLuong) 
                values ('${MaSanPham}', '${MaKho}', '${SoLuong}');`;
        db.query(query2,function(error,result){
            if(error) res.status(500).send('Loi cau lenh truy van');
            let total = Gia * SoLuong;
            let query3 = `Insert into hoadonnhap (MaNhaCungCap, NgayNhap, ThanhTien)
            values ('1', NOW(), '${total}');`;
            db.query(query3,function(error,result){
                if(error) res.status(500).send('Loi cau lenh truy van');
                let idHDN = result.insertId;
                let query3 = `Insert into chitiethoadonnhap (MaHoaDonNhap, MaSanPham, SoLuong, DonGia)
                    values ('${idHDN}', '${MaSanPham}', '${SoLuong}', '${Gia}');`;
                db.query(query3,function(error,result){
                    if(error) res.status(500).send('Loi cau lenh truy van');
                    let query4 = `Update sanpham set SoLuong = '${SoLuong}' where MaSanPham = '${MaSanPham}';`
                    db.query(query4,function(error,result){
                        if(error) res.status(500).send('Loi cau lenh truy van');
                        res.status(200).json(result);
                    });
                });
            });
        });
    });
});
module.exports = router;
