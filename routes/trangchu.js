var router= require('express')();
var db=require('./dbconnext');

router.get('/:sl', (req, res) => {
    var query = `SELECT s.MaSanPham,s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, tskt.ChatLieuVienTiVi, g.Gia 
    FROM sanpham AS s INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham 
    INNER JOIN thongsokythuat AS tskt ON s.MaSanPham = tskt.MaSanPham
    LIMIT ${parseInt(req.params.sl)};
    `;
    db.query(query,(error,result)=>{
        if(error) res.status(500).send('Loi ket noi csdl');
        res.json(result);
    });
  
});
router.get('/get-one/:id',function(req,res){
    var query = `SELECT s.MaSanPham, s.TenSanPham, s.Anh, s.SoLuong, s.Mota, tskt.KichCoManHinh, tskt.DoPhanGiai, tskt.LoaiManHinh, tskt.HeDieuHanh, tskt.ChatLieuChanDe, tskt.ChatLieuVienTiVi, g.Gia 
    FROM sanpham AS s INNER JOIN giaban AS g ON s.MaSanPham = g.MaSanPham 
    INNER JOIN thongsokythuat AS tskt ON s.MaSanPham = tskt.MaSanPham where s.MaSanPham=`+req.params.id ;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});
router.get('/spmv/:sl', function(req, res) {
    var query = `
        SELECT sp.MaSanPham, sp.TenSanPham, sp.Anh, g.Gia, tskt.KichCoManHinh, tskt.DoPhanGiai 
        FROM sanpham AS sp 
        INNER JOIN giaban AS g ON sp.MaSanPham = g.MaSanPham 
        INNER JOIN thongsokythuat AS tskt ON sp.MaSanPham = tskt.MaSanPham 
        ORDER BY NgayTao DESC
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


module.exports = router;