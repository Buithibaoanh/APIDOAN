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
    console.log(req.params.id);

    var query = `UPDATE donhang SET TrangThai = '${TrangThai}' WHERE MaDonHang = '${req.params.id}'`;
    console.log(query);
    db.query(query, function(error, result) {
        if (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(result);
        }
    });
});
module.exports = router;