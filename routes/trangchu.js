var router= require('express')();
var db=require('./dbconnext');

router.get('/:sl', (req, res) => {
    var query = `SELECT s.MaSanPham,s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, 
                tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, 
                tskt.ChatLieuVienTiVi, g.Gia, SUM(c.SoLuong) AS TongSoLuongDaBan
                FROM sanpham AS s INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham 
                INNER JOIN thongsokythuat AS tskt ON s.MaSanPham = tskt.MaSanPham
                LEFT JOIN chitiethoadonban AS c ON s.MaSanPham = c.MaSanPham
                GROUP BY s.MaSanPham,s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, 
                tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, 
                tskt.ChatLieuVienTiVi, g.Gia
                LIMIT ${parseInt(req.params.sl)}`;
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });
  
});
router.get('/get-one/:id',function(req,res){
    var query = `SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, 
                tskt.KichCoManHinh, tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, 
                tskt.ChatLieuChanDe, tskt.ChatLieuVienTiVi, g.Gia, SUM(c.SoLuong) AS TongSoLuongDaBan
                FROM sanpham AS s INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham 
                INNER JOIN thongsokythuat AS tskt ON s.MaSanPham = tskt.MaSanPham 
                left JOIN chitiethoadonban AS c ON s.MaSanPham = c.MaSanPham
                where s.MaSanPham = ${req.params.id}
                GROUP BY s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, 
                tskt.KichCoManHinh, tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, 
                tskt.ChatLieuChanDe, tskt.ChatLieuVienTiVi, g.Gia`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.get('/spmv/:sl', function(req, res) {
    var query = `
        SELECT sp.MaSanPham, sp.TenSanPham, sp.Anh, g.Gia, tskt.KichCoManHinh, 
        tskt.DoPhanGiai, SUM(c.SoLuong) AS TongSoLuongDaBan
        FROM sanpham AS sp 
        INNER JOIN giaban AS g ON sp.MaSanPham = g.MaSanPham 
        INNER JOIN thongsokythuat AS tskt ON sp.MaSanPham = tskt.MaSanPham 
        LEFT JOIN chitiethoadonban AS c ON sp.MaSanPham = c.MaSanPham
        GROUP BY sp.MaSanPham, sp.TenSanPham, sp.Anh, g.Gia, tskt.KichCoManHinh, tskt.DoPhanGiai
        ORDER BY sp.NgayTao DESC
        LIMIT ${parseInt(req.params.sl)};
    `;

    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });
});
router.get('/categori/:id', function(req, res) {
    var query = `
    Select sp.MaLoai, sp.MaSanPham ,sp.TenSanPham, sp.Anh,sp.Mota, ts.KichCoManHinh, ts.DoPhanGiai,ts.LoaiManHinh,ts.HeDieuHanh,ts.ChatLieuChanDe,ts.ChatLieuVienTiVi,g.Gia
    from SanPham as sp inner join ThongSoKyThuat as ts 
    on sp.MaSanPham = ts.MaSanPham inner join GiaBan as g 
    on sp.MaSanPham=g.MaSanPham
    where MaLoai =  ${parseInt(req.params.id)};
    `;

    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });
});

router.post('/search', function(req, res){
    let keyword = req.body.keyword;
    var query = `SELECT s.MaSanPham,s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, 
                tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, 
                tskt.ChatLieuVienTiVi, g.Gia, SUM(c.SoLuong) AS TongSoLuongDaBan
                FROM sanpham AS s INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham 
                INNER JOIN thongsokythuat AS tskt ON s.MaSanPham = tskt.MaSanPham
                LEFT JOIN chitiethoadonban AS c ON s.MaSanPham = c.MaSanPham
                GROUP BY s.MaSanPham,s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, 
                tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, 
                tskt.ChatLieuVienTiVi, g.Gia
                where s.TenSanPham like '%${keyword}'`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });
});


module.exports = router;