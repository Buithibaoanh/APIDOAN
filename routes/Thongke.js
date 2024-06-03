var router= require('express')();
var db=require('./dbconnext');
router.get('/thongketheongay/:day', function(req, res) {
    var ngay = req.params.day; // Assuming the date is passed in the URL parameter
    var query = `
                SELECT 
                kh.MaKhachHang,
                kh.TenKhachHang,
                sp.MaSanPham,
                sp.TenSanPham,
                ctdh.GiaBan,
                SUM(ctdh.SoLuong) AS TongSoLuong,
                SUM(ctdh.GiaBan * ctdh.SoLuong) AS TongThanhTien
            FROM 
                donhang AS dh
                INNER JOIN chitietdonhang AS ctdh ON dh.MaDonHang = ctdh.MaDonHang
                INNER JOIN khachhang AS kh ON dh.MaKhachHang = kh.MaKhachHang
                INNER JOIN sanpham AS sp ON ctdh.MaSanPham = sp.MaSanPham
            WHERE 
                DATE(dh.NgayDat) = '${ngay}'
                AND dh.TrangThai = 1
            GROUP BY 
                kh.MaKhachHang,
                kh.TenKhachHang,
                sp.MaSanPham,
                sp.TenSanPham,
                ctdh.GiaBan;
    `;

    db.query(query, function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send('Loi cau lenh truy van');
        } else {
            res.json(result);
        }
    });
});

router.get('/thongketheothang/:month', function(req, res) {
    var thang = req.params.month; // Assuming the month is passed in the URL parameter (format: 'YYYY-MM')

    var query = `
        SELECT

            kh.TenKhachHang, 
            ctdh.MaSanPham,
            sp.TenSanPham,
            sp.Anh, 
            ctdh.GiaBan, 
            ctdh.SoLuong,
            (ctdh.GiaBan * ctdh.SoLuong) AS ThanhTien,
            CAST(dh.NgayDat AS DATE) AS NgayBan
        FROM 
            donhang AS dh
            INNER JOIN chitietdonhang AS ctdh ON dh.MaDonHang = ctdh.MaDonHang
            INNER JOIN khachhang AS kh ON dh.MaKhachHang = kh.MaKhachHang
            INNER JOIN sanpham AS sp ON ctdh.MaSanPham = sp.MaSanPham
        WHERE 
            DATE_FORMAT(dh.NgayDat, '%Y-%m') = ?
            AND dh.TrangThai = 1

        GROUP BY 
            
            kh.TenKhachHang, 
            ctdh.MaSanPham,
            sp.TenSanPham,
            sp.Anh, 
            ctdh.GiaBan, 
            ctdh.SoLuong,
            CAST(dh.NgayDat AS DATE)
    `;

    db.query(query, [thang], function(error, result) {
        if (error) {
            console.error(error);
            res.status(500).send('Loi cau lenh truy van');
        } else {
            res.json(result);
        }
    });
});
module.exports = router;