var router= require('express')();
var db=require('./dbconnext');

router.get('/', (req, res) => {
    var query = `
        SELECT 
            hdn.MaHoaDonNhap,
            hdn.NgayNhap,
            hdn.ThanhTien,
            ncc.TenNhaCungCap,
            hdn.created_at,
            hdn.updated_at
        FROM 
            hoadonnhap hdn
        INNER JOIN 
            nhacungcap ncc ON hdn.MaNhaCungCap = ncc.MaNhaCungCap
        ORDER BY 
            hdn.created_at DESC;
    `;
    db.query(query, (error, result) => {
        if (error) return res.status(500).send('Lỗi kết nối cơ sở dữ liệu');
        res.json(result);
    });
});

router.post('/Them', function(req, res) {
    var MaSanPham = req.body.MaSanPham;
    var SoLuong = req.body.SoLuong;
    var Gia = req.body.Gia;
    var MaNhaCungCap = req.body.MaNhaCungCap;


    // Thêm hóa đơn nhập
    let query1 = `INSERT INTO hoadonnhap (MaNhaCungCap, NgayNhap, ThanhTien, created_at, updated_at) 
                        VALUES ('${MaNhaCungCap}', NOW(), '${SoLuong * Gia}', NOW(), NOW())`;
    db.query(query1, function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send('Lỗi khi thêm hóa đơn nhập');
            return;
        }

        let idHDN = result.insertId;

        // Thêm chi tiết hóa đơn nhập
        let query2 = `INSERT INTO chitiethoadonnhap (MaHoaDonNhap, MaSanPham, SoLuong, DonGia, created_at, updated_at) 
                            VALUES ('${idHDN}', '${MaSanPham}', '${SoLuong}', '${Gia}', NOW(), NOW())`;
        db.query(query2, function(error, result) {
            if (error) {
                console.error(error);
                res.status(500).send('Lỗi khi thêm chi tiết hóa đơn nhập');
                return;
            }

            // Cập nhật số lượng sản phẩm
            let query3 = `UPDATE sanpham SET SoLuong = SoLuong + ${SoLuong} WHERE MaSanPham = '${MaSanPham}'`;
            db.query(query3, function(error, result) {
                if (error) {
                    console.error(error);
                    res.status(500).send('Lỗi khi cập nhật số lượng sản phẩm');
                    return;
                }

                res.status(200).json({ message: 'Đã thêm hóa đơn nhập thành công' });
            });
        });
    });
});

// chi tiết hóa đơn nhập
router.get('/get-one/:id', function(req, res) {
    var query = `
        SELECT 
            hdn.MaHoaDonNhap, 
            sp.TenSanPham, 
            ctdh.SoLuong, 
            ctdh.DonGia, 
            ctdh.SoLuong * ctdh.DonGia AS ThanhTien
            
        FROM 
            ChiTietHoaDonNhap AS ctdh
            INNER JOIN SanPham AS sp ON ctdh.MaSanPham = sp.MaSanPham
            INNER JOIN HoaDonNhap AS hdn ON ctdh.MaHoaDonNhap = hdn.MaHoaDonNhap
            
        WHERE 
            hdn.MaHoaDonNhap = ${req.params.id}`;
    
    db.query(query, function(error, result) {
        if (error) {
            res.status(500).send('Loi cau lenh truy van');
        } else {
            res.json(result);
        }
    });
});

//api lấy ra chi tiết hóa đơn nhập theo mã
router.get('/get-one-hoadonnhap/:id',function(req,res){
    var query ='SELECT * FROM hoadonnhap where MaHoaDonNhap= '+req.params.id;
    db.query(query,function(error,result){
        if(error) res.status(500).send('Loi cau lenh truy van');
        res.json(result);

    });
});

module.exports = router;
