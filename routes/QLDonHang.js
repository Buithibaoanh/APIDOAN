var router= require('express')();
var db=require('./dbconnext');



router.get('/', (req, res) => {
    var query = `
        SELECT 
            d.MaDonHang, 
            k.TenKhachHang, 
            k.DiaChi, 
            k.SoDienThoai, 
            d.NgayDat,
            CASE 
                WHEN d.TrangThai = 1 THEN 'Processed'
                ELSE 'Pending'
            END AS TrangThaiText
        FROM 
            donhang AS d 
            INNER JOIN khachhang AS k ON d.MaKhachHang = k.MaKhachHang
        Order by d.MaDonHang desc
    `;
    
    db.query(query, (error, result) => {
        if (error) {
            res.status(500).send('Loi ket noi csdl');
        } else {
            res.json(result);
        }
    });
});

router.post('/ThemDH', async (req, res) => {
    
    try {
        const {
            Hoten,
            Sdt,
            Email,
            Diachi,
            Tongtien,
            Sanphamjson,
        } = req.body;

        var iDKH = 0;

        const queryKhachHang = `SELECT * FROM khachhang WHERE Email = '${Email}'`;
        db.query(queryKhachHang, (error, result) => {
            if(error)  res.status(500).send('Loi ket noi csdl');
            else{
                if(result.length > 0){
                    iDKH = result[0].MaKhachHang;
                }else{
                    const insertKH = `insert into khachhang (TenKhachHang,SoDienThoai, DiaChi, Email, created_at, updated_at)
                                        Values('${Hoten}', '${Sdt}', '${Diachi}', '${Email}', Now(), Now());`
                    db.query(insertKH,(error,result)=>{
                        if(error) res.status(500).send('Loi ket noi csdl');
                        else{
                            console.log(result);
                            iDKH = result.insertId;

                            const inserdh = `INSERT INTO donhang (MaKhachHang, NgayDat, TrangThai, ThanhTien)
                                    VALUES ('${iDKH}', NOW(), 0, '${Tongtien}')`;
                            db.query(inserdh, (error, result) => {
                                if(error) res.status(500).send('Loi ở đơn hàng');
                                else{
                                    const Donhang_id = result.insertId;
                                    const sanphamData = JSON.parse(Sanphamjson);
                                    // console.log(sanphamData);
                                    
                                    for (const sanpham of sanphamData) {
                                        const { MaSanPham, quantity, Gia } = sanpham;

                                        const query = `
                                            INSERT INTO chitietdonhang (MaDonHang, MaSanPham, SoLuong, GiaBan)
                                            VALUES (?, ?, ?, ?)`;
                                        db.query(query, [Donhang_id, MaSanPham, quantity, Gia]);
                                    }

                                    res.status(200).json(result);
                                }
                            });
                        }

                    }); 
                }
                

            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Lỗi câu lệnh truy vấn');
    }
  
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
            ctdh.SoLuong * ctdh.GiaBan AS ThanhTien
        FROM 
            ChiTietDonHang AS ctdh
            INNER JOIN SanPham AS sp ON ctdh.MaSanPham = sp.MaSanPham
            INNER JOIN DonHang AS dh ON ctdh.MaDonHang = dh.MaDonHang
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

router.post('/edit/:id', function(req, res) {
    var { TrangThai } = req.body;
    
    var updateQuery = `UPDATE donhang SET TrangThai = '${TrangThai}' WHERE MaDonHang = '${req.params.id}'`;
    
    // Thực hiện truy vấn cập nhật trạng thái đơn hàng
    db.query(updateQuery, function(error, result) {
        if (error) {
            console.error('Error updating order status:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        // Thực hiện truy vấn lấy dữ liệu đơn hàng
        var selectQuery = `SELECT * FROM chitietdonhang as c 
                            INNER JOIN donhang as d 
                            ON c.MaDonHang = d.MaDonHang
                            WHERE c.MaDonHang = '${req.params.id}'`;
        
        db.query(selectQuery, function(error, result) {
            if (error) {
                console.error('Error querying order:', error);
                return res.status(500).send('Internal Server Error');
            }
            var processedData = [];

            result.forEach(function(item) {
                var existingIndex = processedData.findIndex(function(element) {
                    return element.MaDonHang === item.MaDonHang;
                });

                if (existingIndex === -1) {
                    processedData.push({
                        MaDonHang: item.MaDonHang,
                        MaKhachHang: item.MaKhachHang,
                        ThanhTien: item.thanhtien,
                        chitietdonhang: [{
                            MaChiTietDonHang: item.MaChiTietDonHang,
                            MaSanPham: item.MaSanPham,
                            SoLuong: item.SoLuong,
                            GiaBan: item.GiaBan
                        }]
                    });
                } else {
                    processedData[existingIndex].chitietdonhang.push({
                        MaChiTietDonHang: item.MaChiTietDonHang,
                        MaSanPham: item.MaSanPham,
                        SoLuong: item.SoLuong,
                        GiaBan: item.GiaBan
                    });
                }
            });

            processedData.forEach((item) => {
                var insertHDB = `INSERT INTO hoadonban (MaKhachHang, NgayBan, ThanhTien, created_at, updated_at) 
                                VALUES ('${item.MaKhachHang}', Now(), '${item.ThanhTien}', Now(), Now())`;
                
                // Thực hiện truy vấn thêm hóa đơn bán
                db.query(insertHDB, function(error, result) {
                    if (error) {
                        console.error('Error inserting sale invoice:', error);
                        return res.status(500).send('Internal Server Error');
                    }
                    
                    var idHDB = result.insertId;
                    item.chitietdonhang.forEach((row) => {
                        var insertCTHDB = `INSERT INTO chitiethoadonban (MaHoaDonBan, MaSanPham, SoLuong, GiaBan, created_at, updated_at)
                                            VALUES ('${idHDB}', '${row.MaSanPham}', '${row.SoLuong}', '${row.GiaBan}', Now(), Now())`;
        
                        // Thực hiện truy vấn thêm chi tiết hóa đơn bán
                        db.query(insertCTHDB, function(error, result) {
                            if (error) {
                                console.error('Error inserting sale invoice details:', error);
                                return res.status(500).send('Internal Server Error');
                            }
                            
                            return res.status(200).json(result);
                        });
                    })
                });
            })

        });
    });
    return res.status(200).json();
});
module.exports = router;