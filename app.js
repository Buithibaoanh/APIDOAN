var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');
var bodyparser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const fileUpload = require('express-fileupload');
app.use(bodyparser.urlencoded({extended : false}));

app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var loaispRoute=require('./routes/loaisp');
app.use('/loaisp',loaispRoute);

var QLSanphamRoute=require('./routes/QLSanpham');
app.use('/QLSanpham',QLSanphamRoute);

var QLKhachhangRoute=require('./routes/QLKhachhang');
app.use('/QLKhachhang',QLKhachhangRoute);

var QLNhaCCRoute=require('./routes/QLNhaCC');
app.use('/QLNhaCC',QLNhaCCRoute);

var QLHoaDonBanRoute=require('./routes/QLHoaDonBan');
app.use('/QLHoaDonBan',QLHoaDonBanRoute);

var QLtrangchuRoute=require('./routes/trangchu');
app.use('/trangchu',QLtrangchuRoute);

var QLDonHangRoute=require('./routes/QLDonHang');
app.use('/QLDonHang',QLDonHangRoute);

var ThongkeRoute=require('./routes/Thongke');
app.use('/Thongke',ThongkeRoute);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
