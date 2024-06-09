var router= require('express')();
var db=require('./dbconnext');
 // lấy ra thông tin khách hàng
 router.get('/', (req, res) => {
    var query = `
        SELECT 
            kh.MaKhachHang,
            kh.TenKhachHang,
            kh.SoDienThoai,
            kh.DiaChi,
            kh.Email,
            kh.created_at,
            GROUP_CONCAT(dh.MaDonHang) AS DanhSachDonHang,
            SUM(dh.thanhtien) AS TongThanhTien
        FROM 
            khachhang kh
        LEFT JOIN 
            donhang dh ON kh.MaKhachHang = dh.MaKhachHang
        GROUP BY 
            kh.MaKhachHang, 
            kh.TenKhachHang, 
            kh.SoDienThoai, 
            kh.DiaChi, 
            kh.Email, 
            kh.created_at
        ORDER BY 
            kh.created_at DESC;
    `;
    db.query(query, (error, result) => {
        if (error) return res.status(500).send('Lỗi kết nối cơ sở dữ liệu');
        res.json(result);
    });
});
// router.get('/get-one/:id',function(req,res){
//     var query ='SELECT * FROM khachhang where makhachhang= '+req.params.id;
//     db.query(query,function(error,result){
//         if(error) res.status(500).send('Loi cau lenh truy van');
//         res.json(result);

//     });
// });
router.get('/getOrders/:id',function(req,res){

    let { id } = req.params;
    console.log(id);
    var query = `SELECT s.TenSanPham
                FROM donhang as dh inner join 
                chitietdonhang as ctdh on dh.MaDonHang = ctdh.MaDonHang
                inner join sanpham as s on ctdh.MaSanPham = s.MaSanPham
                where dh.MaDonHang in (${id})`;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});

// });
// router.post('/add',function(req,res){
//     var tenkhachhang= req.body.TenKhachHang;
//     var sodienthoai= req.body.SoDienThoai;
//     var diachi= req.body.DiaChi;
//     var email= req.body.Email;
//     var anh= req.body.Anh;
//     var query="insert into khachhang (TenKhachHang,SoDienThoai,DiaChi,Email,Anh,created_at) values('"+tenkhachhang+"','"+sodienthoai+"','"+diachi+"','"+email+"','"+anh+"',NOW())";
//     db.query(query,function(error,result){
//         if(error) res.status(500).send('Loi cau lenh truy van');
//         res.status(200).json(result);

//     });

// });
// router.delete('/remove/:id',function(req,res){
//     console.log(req.params.id);
//     var query='delete from khachhang where makhachhang='+req.params.id;
//     db.query(query,function(error,result){
//         if(error) res.status(500).send('Loi cau lenh truy van');
//         res.json(result);
//     });

// });
module.exports = router;
