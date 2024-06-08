var router= require('express')();
var db=require('./dbconnext');

router.get('/', (req, res) => {
    var query = `
        SELECT 
            ncc.MaNhaCungCap,
            ncc.TenNhaCungCap,
            ncc.SoDienThoai,
            ncc.DiaChi,
            
            ncc.created_at,
            ncc.updated_at,
            SUM(hdn.ThanhTien) AS TongThanhTien
        FROM 
            nhacungcap ncc
        LEFT JOIN 
            hoadonnhap hdn ON ncc.MaNhaCungCap = hdn.MaNhaCungCap
        GROUP BY 
            ncc.MaNhaCungCap, 
            ncc.TenNhaCungCap, 
            ncc.SoDienThoai, 
            ncc.DiaChi, 
             
            ncc.created_at, 
            ncc.updated_at
        ORDER BY 
            ncc.created_at DESC;
    `;
    db.query(query, (error, result) => {
        if (error) return res.status(500).send('Lỗi kết nối cơ sở dữ liệu');
        res.json(result);
    });
});
router.get('/get-one/:id',function(req,res){
    var query ='SELECT * FROM nhacungcap where MaNhaCungCap= '+req.params.id;
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
    var query="update nhacungcap set TenNhaCungCap='"+ tennhacungcap+"',SoDienThoai='"+sodienthoai+"',DiaChi='"+diachi+"', updated_at=NOW() where MaNhaCungCap='"+req.params.id+"'";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });

});
router.post('/add',function(req,res){
    var tennhacungcap= req.body.TenNCC;
    var sodienthoai= req.body.SĐT;
    var diachi= req.body.DiaChi;
    
    var query="insert into nhacungcap (TenNhaCungCap,SoDienThoai,DiaChi,created_at) values('"+tennhacungcap+"','"+sodienthoai+"','"+diachi+"',NOW())";
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.status(200).json(result);

    });

});
router.delete('/remove/:id',function(req,res){
    console.log(req.params.id);
    var query='delete from nhacungcap where MaNhaCungCap='+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);
    });

});
module.exports = router;
