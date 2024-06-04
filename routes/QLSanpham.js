var router= require('express')();
var db=require('./dbconnext');

router.get('/',(req,res)=>{
    var query=`SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong,g.Gia, s.Mota, l.TenLoai, 
                SUM(c.SoLuong) AS TongSoLuongDaBan
                FROM sanpham AS s
                INNER JOIN loaisanpham AS l ON s.MaLoai = l.MaLoai
                INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham
                LEFT JOIN chitietdonhang AS c ON s.MaSanPham = c.MaSanPham
                GROUP BY s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong,g.Gia, s.Mota, l.TenLoai
                ORDER BY s.MaSanPham desc`;
    console.log(query);
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        return res.json(result);
    });

});
router.get('/get-one/:id',function(req,res){
    var query =`SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong,g.Gia, s.Mota, l.TenLoai, l.MaLoai
        from sanpham as s inner join loaisanpham as l on s.MaLoai = l.MaLoai 
        INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham where s.MaSanPham='${+req.params.id}'`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.put('/edit/:id',function(req,res){
    var tensanpham= req.body.TenSanPham;
    var maloai= req.body.MaLoai;
    var gia= req.body.Gia;
    var anh= req.body.Anh;
    var soluong= req.body.SoLuong;
    var mota= req.body.Mota;
    console.log(req.params.id);
    const updateProductQuery = `
        UPDATE sanpham SET TenSanPham = '${tensanpham}', MaLoai = '${maloai}', 
        SoLuong = '${soluong}', Mota = '${mota}', updated_at = NOW() WHERE MaSanPham = '${req.params.id}'`;

    db.query(updateProductQuery, function (error, result) {
        if (error) {
            console.log(error);
            return res.status(500).send('Loi cau lenh truy van'); // Send error response immediately
        }

        const updatePriceQuery = `
        UPDATE giaban
        SET Gia = '${gia}'
        WHERE MaSanPham = '${req.params.id}'`;

        db.query(updatePriceQuery, function (error, result) {
            if (error) {
                return res.status(500).send('Loi cau lenh truy van'); // Send error response only for price update
            }

            // All updates successful, send success response
        });
        res.status(200).json('Cap nhat san pham thanh cong!');
    });

});


router.post('/add',function(req,res){
    var tensanpham= req.body.TenSanPham;
    var maloai= req.body.MaLoai;
    var gia= req.body.Gia;
    var anh= req.body.Anh;
    var soluong= req.body.SoLuong;
    var mota= req.body.Mota;
    var query=`insert into sanpham (TenSanPham,MaLoai,Anh,SoLuong,Mota,NgayTao,created_at) 
    values('${tensanpham}','${maloai}','${anh}','${soluong}','${mota}',NOW(),NOW())`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        var idgia = result.insertId;

        let queryGia = `Insert into giaban (MaSanPham, Gia, created_at) values ('${idgia}', '${gia}',NOW())`;
        db.query(queryGia,function(error,result){
            if(error) res.status(500).send('Loi cau lenh truy van');
        });
    });
    return res.status(200);

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

router.post('/search',function(req,res){
    var keyword= req.body.keyword;
    console.log(keyword);

    var query = `SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, l.TenLoai, 
                SUM(c.SoLuong) AS TongSoLuongDaBan
                FROM sanpham AS s
                INNER JOIN loaisanpham AS l ON s.MaLoai = l.MaLoai
                LEFT JOIN chitiethoadonban AS c ON s.MaSanPham = c.MaSanPham
                where s.TenSanPham like '%${keyword}%' or l.TenLoai like '%${keyword}%'
                GROUP BY s.MaSanPham`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });
});
module.exports = router;
