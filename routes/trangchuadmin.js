var router= require('express')();
var db=require('./dbconnext');  // Đảm bảo tên file này đúng với tên file kết nối cơ sở dữ liệu của bạn
var moment = require('moment-timezone');


// Endpoint để lấy thống kê đơn hàng và doanh thu của ngày hôm nay
router.get('/orders', (req, res) => {
  // Lấy ngày hôm nay theo múi giờ của bạn, ví dụ: 'Asia/Ho_Chi_Minh'
  const today = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
  console.log('Today\'s date:', today); // Log ngày hiện tại
  
  const query = `
    SELECT SUM(thanhtien) AS total_revenue 
    FROM DonHang 
    WHERE DATE(NgayDat) = ? and TrangThai = 3`;

  db.query(query, [today], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log('Query result:', result); // Log kết quả từ cơ sở dữ liệu
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(result[0] || { total_revenue: 0 }); // Trả về 0 nếu không có kết quả
  });
});

//tổng đơn hàng có trạng thái là 0
router.get('/orders/status-0', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS total_orders 
    FROM DonHang 
    WHERE DATE(NgayDat) = ?
    AND TrangThai = 0`;

  db.query(query, [today], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0]);
});

// lấy đơn hàng có trạng thai la2
router.get('/orders/status-2', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS total_orders 
    FROM DonHang 
    WHERE DATE(NgayDat) = ?
    AND TrangThai = 2`;

  db.query(query, [today], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0]);
  });
}); 

// tính tổng đơn hàng hôm nay
router.get('/orders/summary', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT COUNT(*) AS total_orders, SUM(thanhtien) AS total_revenue 
    FROM DonHang 
      WHERE DATE(NgayDat) = ? `;

  db.query(query,[today], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0]);
  });
});

//đơn hàng theo ngày
router.get('/orders/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT 
        d.MaDonHang, 
        k.TenKhachHang, 
        k.DiaChi, 
        k.SoDienThoai, 
        d.NgayDat,
        d.thanhtien,
        CASE 
            WHEN d.TrangThai = 0 THEN 'Chờ xác nhận'
            WHEN d.TrangThai = 1 THEN 'Đã xác nhận'
            WHEN d.TrangThai = 2 THEN 'Đang giao hàng'
            WHEN d.TrangThai = 3 THEN 'Giao thành công'
            WHEN d.TrangThai = 4 THEN 'Đã hoàn hàng'
            ELSE 'Trạng thái không xác định'
        END AS TrangThaiText
    FROM 
        donhang AS d 
        INNER JOIN khachhang AS k ON d.MaKhachHang = k.MaKhachHang
    WHERE 
        DATE(d.NgayDat) = ?
    ORDER BY 
        d.MaDonHang DESC;`;

  db.query(query, [today], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});
//api chi tiết đơn hàng
router.get('/get-one/:id', function(req, res) {
  var query = `
      SELECT 
          dh.MaDonHang, 
          sp.TenSanPham, 
          sp.Anh, 
          ctdh.SoLuong, 
          ctdh.GiaBan,
          ctdh.SoLuong * ctdh.GiaBan AS ThanhTien,
          k.TenKhachHang, k.SoDienThoai, k.DiaChi
      FROM 
          ChiTietDonHang AS ctdh
          INNER JOIN SanPham AS sp ON ctdh.MaSanPham = sp.MaSanPham
          INNER JOIN DonHang AS dh ON ctdh.MaDonHang = dh.MaDonHang
          inner join khachhang as k on dh.MaKhachHang = k.MaKhachHang
      WHERE 
          dh.MaDonHang = ${req.params.id}`;
  
  db.query(query, function(error, result) {
      if (error) {
          res.status(500).send('Loi cau lenh truy van');
      } else {
          res.json(result);
      }
  });
});

//api lấy ra đơn hàng theo mã đơn hàng
router.get('/get-one-donhang/:id',function(req,res){
  var query ='SELECT * FROM donhang where MaDonHang= '+req.params.id;
  db.query(query,function(error,result){
      if(error) res.status(500).send('Loi cau lenh truy van');
      res.json(result);

  });
});

router.post('/orders/Thongke', (req, res) => {
  const { startDate, endDate } = req.body;

  // Kiểm tra các tham số đầu vào
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required parameters: startDate, endDate' });
  }

  const query = `SELECT 
                kh.MaKhachHang,
                kh.TenKhachHang,
                sp.MaSanPham,
                sp.TenSanPham,
                ctdh.GiaBan,
                SUM(ctdh.SoLuong) AS TongSoLuong,
                SUM(ctdh.GiaBan * ctdh.SoLuong) AS TongThanhTien,
                kh.SoDienThoai,
                kh.DiaChi,
                dh.created_at,
                dh.MaDonHang
            FROM 
                donhang AS dh
                INNER JOIN chitietdonhang AS ctdh ON dh.MaDonHang = ctdh.MaDonHang
                INNER JOIN khachhang AS kh ON dh.MaKhachHang = kh.MaKhachHang
                INNER JOIN sanpham AS sp ON ctdh.MaSanPham = sp.MaSanPham
            WHERE NgayDat BETWEEN ? AND ? and TrangThai = 3
            GROUP BY 
                kh.MaKhachHang,
                kh.TenKhachHang,
                sp.MaSanPham,
                sp.TenSanPham,
                ctdh.GiaBan,
                kh.SoDienThoai,
                kh.DiaChi,
                dh.MaDonHang,
                dh.created_at`

  db.query(query, [startDate, endDate], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

});
module.exports = router;