var router = require('express')();
var nodemailer = require('nodemailer');

const mysql = require('mysql2/promise');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'bantivi'
};

var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "daonhatviet2912@gmail.com",
        pass: "fgvqsdsyglfvfalp"
    }
})

router.post('/send', async (req, res) => {
    try{
        const { email } = req.body;
        const info = await transport.sendMail({
            from: `"Công ty điện máy xanh Tiến Sáng daonhatviet2912@gmail.com`,
            to: email,
            subject: `Bạn đã đặt hàng thành công`,
            text: `Bạn đã đặt hàng thành công`,
            html: ``,
        });
        return res.json("success");
    }
    catch (error) {
        throw error;
    }
})

router.post('/sendConfirm', async (req, res) => {
    const { email, maDonHang } = req.body;
    const connection = await mysql.createConnection(dbConfig);

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
            dh.MaDonHang = ?`;

    const [result] = await connection.execute(query, [maDonHang]);

    const totalQuantity = result.reduce((acc, item) => acc + item.SoLuong, 0);
    const totalValue = result.reduce((acc, item) => acc + item.ThanhTien, 0);
    

    const info = await transport.sendMail({
        from: `"Công ty điện máy xanh Tiến Sáng daonhatviet2912@gmail.com`,
        to: email,
        subject: `Đơn hàng của bạn đã được xác nhận`,
        text: `Đơn hàng của bạn đã được xác nhận`,
        html: `
          <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="style.css" />
                    <title>Browser</title>
                </head>
                <body>
                    <div class="conent">
                        <h3 style="text-align: center">Hóa đơn bán</h3>
                        <hr>
                        <div class="d-flex">
                            <div>
                                Thông tin khách hàng
                                <p>Họ và tên: ${result[0].TenKhachHang}</p>
                                <p>Số điện thoại: ${result[0].SoDienThoai} </p>
                                <p>Địa chỉ giao hàng: ${result[0].DiaChi} <p>
                                <p>Phương thức thanh toán:Thanh toán khi nhận hàng</p>
                            </div>
                        </div>
                        <div>
                            <h3>Thông tin hóa đơn </h3>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th style="text-align: left">Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá </th>
                                        <th>Tổng giá trị</th>
                                    <tr>
                                </thead>
                                <tbody>
                                    ${result.map(item => `
                                        <tr>
                                            <td>${item.TenSanPham}</td>
                                            <td>${item.SoLuong}</td>
                                            <td>${formatVND(item.GiaBan)}</td>
                                            <td>${formatVND(item.ThanhTien)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            <div style="text-align: left; margin-top: 30px">
                                Tổng số lượng sản phẩm: ${totalQuantity}
                            </div>
                            <div style="text-align: left; margin-top: 30px">
                                Thành tiền: ${formatVND(totalValue)}
                            </div>
                        </div>
                    </div>
                </body>

            </html>
        `,
    });

    return result.join("success");
})

router.post('/sendDangGiao', async (req, res) => {
    try{
        const { email } = req.body;
        const info = await transport.sendMail({
            from: `"Công ty điện máy xanh Tiến Sáng daonhatviet2912@gmail.com`,
            to: email,
            subject: `Đơn hàng của bạn đã bàn giao cho đơn vị vẩn chuyển`,
            text: `Đơn hàng của bạn đã bàn giao cho đơn vị vẩn chuyển`,
            html: ``,
        });
        return res.json("success");
    }
    catch (error) {
        throw error;
    }
})

function formatVND(number) {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

module.exports = router;