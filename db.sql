-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 31, 2023 lúc 10:29 AM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db`
--
CREATE DATABASE IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_filter` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `id_user`, `id_filter`, `quantity`) VALUES
(118, 30, 154, 1),
(122, 34, 154, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createAt` date NOT NULL DEFAULT current_timestamp(),
  `updateAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `createAt`, `updateAt`) VALUES
(1, 'iPhone(IOS)', '2023-03-14', '2023-03-14'),
(2, 'Android', '2023-03-14', '2023-03-14'),
(3, 'Khác', '2023-03-14', '2023-03-14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `filter`
--

CREATE TABLE `filter` (
  `id` int(11) NOT NULL,
  `id_pro` int(11) NOT NULL,
  `color` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `img` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `filter`
--

INSERT INTO `filter` (`id`, `id_pro`, `color`, `size`, `quantity`, `img`, `price`, `deleted`) VALUES
(28, 26, 'Đen', '128GB', 20, '1683654562410Đen.jpg', 11980000, 0),
(29, 26, 'Đen', '256GB', 50, '1683654562410Đen.jpg', 12500000, 0),
(30, 26, 'Trắng ', '256GB', 10, '1683654605713Trắng.jpg', 14500000, 0),
(32, 26, 'Yellow', '64GB', 10, '168388334932743e524675ae180bfd9f08.jpg', 11980000, 1),
(33, 26, 'Đen', '128GB', 1, '1683883539061c419fed780515a0f034010.jpg', 3000, 1),
(34, 26, 'Do', '64GB', 30, '168388358698199a2ab67cbe111bf48f04.jpg', 3000, 1),
(35, 26, 'Do', '64GB', 30, '168388377687799a2ab67cbe111bf48f04.jpg', 3000, 1),
(36, 26, 'Do', '64GB', 30, '168388377949399a2ab67cbe111bf48f04.jpg', 3000, 1),
(37, 26, 'Đen', '128GB', 20, '1683885133271f44ee27b82fd58a301ec1.jpg', 11980000, 1),
(38, 28, 'Đen', '128GB', 15, '1684229743235Đen.jpg', 10500000, 0),
(39, 28, 'Đen', '64GB', 20, '1684229743235Đen.jpg', 10000000, 0),
(40, 28, 'Đen', '256GB', 19, '1684229743235Đen.jpg', 11000000, 0),
(41, 28, 'Trắng', '256GB', 10, '1684229832029Trang.jpg', 11200000, 0),
(42, 28, 'Trắng', '128GB', 10, '1684229832029Trang.jpg', 10400000, 0),
(43, 28, 'Trắng', '64GB', 28, '1684229832029Trang.jpg', 10200000, 0),
(44, 29, 'Đen', '256GB', 15, '1684230323690Đen.jpg', 15500000, 0),
(45, 29, 'Đen', '128GB', 30, '1684230323690Đen.jpg', 15000000, 0),
(46, 29, 'Đen', '64GB', 30, '1684230323690Đen.jpg', 14500000, 0),
(47, 29, 'Đỏ', '64GB', 30, '1684230361506Do.jpg', 14500000, 0),
(48, 29, 'Đỏ', '128GB', 34, '1684230361506Do.jpg', 14900000, 0),
(49, 29, 'Đỏ', '256GB', 23, '1684230361506Do.jpg', 15350000, 0),
(50, 29, 'Tím', '256GB', 23, '1684230418474Tim.jpg', 15600000, 0),
(51, 29, 'Tím', '128GB', 22, '1684230418474Tim.jpg', 15100000, 0),
(52, 29, 'Tím', '64GB', 18, '1684230418474Tim.jpg', 14600000, 0),
(53, 29, 'Xanh', '64GB', 10, '1684230495597XanhDuong.jpg', 14200000, 0),
(54, 29, 'Xanh', '128GB', 15, '1684230495597XanhDuong.jpg', 14800000, 0),
(55, 29, 'Xanh', '256GB', 30, '1684230495597XanhDuong.jpg', 15300000, 0),
(56, 29, 'Trắng', '256GB', 50, '1684230580762Trang.jpg', 15300000, 0),
(57, 29, 'Trắng', '128GB', 35, '1684230580762Trang.jpg', 14700000, 0),
(58, 29, 'Trắng', '64GB', 20, '1684230580762Trang.jpg', 14200000, 0),
(59, 30, 'Bạc', '128GB', 5, '1684230899859Bac.jpg', 22000000, 0),
(60, 30, 'Bạc', '256GB', 7, '1684230899859Bac.jpg', 22500000, 0),
(61, 30, 'Bạc', '512GB', 8, '1684230899859Bac.jpg', 23000000, 0),
(62, 30, 'Gold', '512GB', 10, '1684230960050Vang.jpg', 23500000, 0),
(63, 30, 'Gold', '256GB', 8, '1684230960050Vang.jpg', 23000000, 0),
(64, 30, 'Gold', '128GB', 5, '1684230960050Vang.jpg', 22500000, 0),
(65, 30, 'Xám', '128GB', 10, '1684231004289Xam.jpg', 22200000, 0),
(66, 30, 'Xám', '256GB', 15, '1684231004289Xam.jpg', 22700000, 0),
(67, 30, 'Xám', '512GB', 19, '1684231004289Xam.jpg', 23500000, 0),
(68, 30, 'Xanh', '512GB', 3, '1684231056193XanhDuong.jpg', 23200000, 0),
(69, 30, 'Xanh', '256GB', 10, '1684231056193XanhDuong.jpg', 22800000, 0),
(70, 30, 'Xanh', '128GB', 8, '1684231056193XanhDuong.jpg', 22300000, 0),
(71, 31, 'Bạc', '128GB', 8, '1684231295793Bac.jpg', 24000000, 0),
(72, 31, 'Bạc', '256GB', 10, '1684231295793Bac.jpg', 24500000, 0),
(73, 31, 'Bạc', '512GB', 10, '1684231295793Bac.jpg', 25300000, 0),
(74, 31, 'Xanh', '512GB', 10, '1684231345884Xanh.jpg', 25300000, 0),
(75, 31, 'Xanh', '256GB', 7, '1684231345884Xanh.jpg', 24700000, 0),
(76, 31, 'Xanh', '128GB', 5, '1684231345884Xanh.jpg', 24300000, 0),
(77, 31, 'Đen', '128GB', 5, '1684231378308Đen.jpg', 24300000, 0),
(78, 31, 'Đen', '256GB', 10, '1684231378308Đen.jpg', 24900000, 0),
(79, 31, 'Đen', '512GB', 12, '1684231378308Đen.jpg', 25400000, 0),
(80, 31, 'Gold', '256GB', 12, '1684231441243Trang.jpg', 25800000, 0),
(81, 31, 'Gold', '128GB', 8, '1684231441243Trang.jpg', 25400000, 0),
(82, 31, 'Gold', '512GB', 7, '1684231441243Trang.jpg', 26300000, 0),
(83, 26, 'Xanh', '99GB', 99, '1684246070738Bac.jpg', 9999, 1),
(84, 26, 'Xanh', '128GB', 68, '1684246615010Xanh.jpg', 68, 1),
(85, 26, 'Xanh', '64GB', 68, '1684246660951Xanh.jpg', 68, 1),
(86, 26, 'Xinh', '256GB', 68, '1684246660951Xanh.jpg', 68, 1),
(87, 32, 'Đen', '128GB', 9, '1684247925096Den.jpg', 26100000, 0),
(88, 32, 'Đen', '256GB', 10, '1684247925096Den.jpg', 26800000, 0),
(89, 32, 'Đen', '512GB', 12, '1684247925096Den.jpg', 27800000, 0),
(90, 32, 'Bạc', '512GB', 12, '1684247987742Bac.jpg', 27800000, 0),
(91, 32, 'Bạc', '256GB', 13, '1684247987742Bac.jpg', 26800000, 0),
(92, 32, 'Bạc', '128GB', 13, '1684247987742Bac.jpg', 26400000, 0),
(93, 32, 'Tím', '128GB', 13, '1684248041813Tim.jpg', 26700000, 0),
(94, 32, 'Tím', '256GB', 11, '1684248041813Tim.jpg', 27500000, 0),
(95, 32, 'Tím', '512GB', 5, '1684248041813Tim.jpg', 27900000, 0),
(96, 32, 'Vàng', '512GB', 5, '1684248081053Vang.jpg', 28100000, 0),
(97, 32, 'Vàng', '256GB', 7, '1684248081053Vang.jpg', 27400000, 0),
(98, 32, 'Vàng', '128GB', 6, '1684248081053Vang.jpg', 27000000, 0),
(99, 33, 'Hồng', '128GB', 7, '1684249087725Hong.jpg', 16800000, 0),
(100, 33, 'Hồng', '512GB', 8, '1684249087725Hong.jpg', 189000000, 0),
(101, 33, 'Hồng', '256GB', 10, '1684249087725Hong.jpg', 17300000, 0),
(102, 33, 'Xanh Lá', '256GB', 10, '1684249234148XanhLa.png', 17300000, 0),
(103, 33, 'Xanh Lá', '128GB', 6, '1684249234148XanhLa.png', 18000000, 0),
(104, 33, 'Xanh Lá', '512GB', 9, '1684249234148XanhLa.png', 19500000, 0),
(105, 33, 'Đen', '512GB', 7, '1684249323388Đen.jpg', 19000000, 0),
(106, 33, 'Đen', '256GB', 12, '1684249323388Đen.jpg', 17000000, 0),
(107, 33, 'Đen', '128GB', 18, '1684249323388Đen.jpg', 16000000, 0),
(108, 33, 'Xanh Dương', '128GB', 18, '1684249402076XanhDuong.jpg', 16000000, 0),
(109, 33, 'Xanh Dương', '256GB', 19, '1684249402076XanhDuong.jpg', 17200000, 0),
(110, 33, 'Xanh Dương', '512GB', 13, '1684249402076XanhDuong.jpg', 18200000, 0),
(111, 34, 'Cam', '128GB', 12, '1684249626780Cam.jpg', 8900000, 0),
(112, 34, 'Cam', '64GB', 11, '1684249626780Cam.jpg', 8200000, 0),
(113, 34, 'Đỏ', '64GB', 8, '1684249730714Do.jpg', 7900000, 0),
(114, 34, 'Đỏ', '128GB', 7, '1684249730714Do.jpg', 8000000, 0),
(115, 34, 'Xanh', '128GB', 4, '1684249772381Xanh.jpg', 8700000, 0),
(116, 34, 'Xanh', '64GB', 6, '1684249772381Xanh.jpg', 8500000, 0),
(117, 34, 'Đen', '64GB', 15, '1684249833852Den.jpg', 7800000, 0),
(118, 34, 'Đen', '128GB', 18, '1684249833852Den.jpg', 7990000, 0),
(119, 35, 'Xanh', '128GB', 11, '1684250428115Xanh.jpg', 17000000, 0),
(120, 35, 'Xanh', '256GB', 10, '1684250428115Xanh.jpg', 17500000, 0),
(121, 35, 'Xanh', '512GB', 9, '1684250428115Xanh.jpg', 18500000, 0),
(122, 35, 'Đen', '128GB', 8, '1684250512525Đen.jpg', 17600000, 0),
(123, 35, 'Đen', '256GB', 7, '1684250512525Đen.jpg', 17800000, 0),
(124, 35, 'Đen', '512GB', 6, '1684250512525Đen.jpg', 16400000, 0),
(125, 35, 'Đỏ', '512GB', 17, '1684250565995Do.jpg', 18200000, 0),
(126, 35, 'Đỏ', '256GB', 14, '1684250565995Do.jpg', 18600000, 0),
(127, 35, 'Đỏ', '128GB', 19, '1684250565995Do.jpg', 18100000, 0),
(128, 36, 'Tím', '128GB', 13, '1684250810756Tim.jpg', 18900000, 0),
(129, 36, 'Tím', '256GB', 12, '1684250810756Tim.jpg', 18800000, 0),
(130, 36, 'Vàng', '256GB', 11, '1684250846411Vang.jpg', 18700000, 0),
(131, 36, 'Vàng', '128GB', 10, '1684250846411Vang.jpg', 18600000, 0),
(132, 36, 'Xanh', '128GB', 9, '1684250882483Xanh.jpg', 18500000, 0),
(133, 36, 'Xanh', '256GB', 5, '1684250882483Xanh.jpg', 18300000, 0),
(134, 36, 'Xám', '256GB', 7, '1684250934980Xam.jpg', 18000000, 0),
(135, 36, 'Xám', '128GB', 16, '1684250934980Xam.jpg', 19300000, 0),
(136, 37, 'Kem', '256GB', 17, '1684251136453Kem.jpg', 30000000, 0),
(137, 37, 'Kem', '512GB', 18, '1684251136453Kem.jpg', 31000000, 0),
(138, 37, 'Xanh', '512GB', 13, '1684251192101Xanh.jpg', 30500000, 0),
(139, 37, 'Xanh', '256GB', 14, '1684251192101Xanh.jpg', 30600000, 0),
(140, 37, 'Đen', '256GB', 12, '1684251233859Đen.jpg', 30800000, 0),
(141, 37, 'Đen', '512GB', 10, '1684251233859Đen.jpg', 31600000, 0),
(142, 26, 'Trắng', '128GB', 10, '1684316859379Trang.jpg', 11980000, 0),
(143, 39, 'Xanh', '64GB', 15, '1684339865855Xanh.jpg', 3500000, 0),
(144, 39, 'Xanh', '128GB', 13, '1684339865855Xanh.jpg', 3600000, 0),
(145, 39, 'Đen', '128GB', 10, '1684339904215Đen.jpg', 3700000, 0),
(146, 39, 'Đen', '64GB', 7, '1684339904215Đen.jpg', 3850000, 0),
(147, 40, 'Xanh Hồng', '128GB', 13, '1684340159544XanhHong.jpg', 5000000, 0),
(148, 40, 'Xanh Hồng', '64GB', 10, '1684340159544XanhHong.jpg', 5400000, 0),
(149, 40, 'Vàng', '64GB', 9, '1684340191512Vang.jpg', 5600000, 0),
(150, 40, 'Vàng', '128GB', 18, '1684340191512Vang.jpg', 5200000, 0),
(151, 40, 'Đen', '128GB', 19, '1684340225188Đen.jpg', 5300000, 0),
(152, 40, 'Đen', '64GB', 8, '1684340225188Đen.jpg', 5650000, 0),
(153, 41, 'Xanh', '64GB', 9, '1684340485294Xanh.jpg', 4050000, 0),
(154, 41, 'Xanh', '128GB', 10, '1684340485294Xanh.jpg', 4100000, 0),
(155, 41, 'Đen', '128GB', 5, '1684340528662Đen.jpg', 4200000, 0),
(156, 41, 'Đen', '64GB', 7, '1684340528662Đen.jpg', 4000000, 0),
(157, 42, 'Đen', '128GB', 14, '1684340736446Đen.jpg', 7000000, 0),
(158, 42, 'Đen', '64GB', 10, '1684340736446Đen.jpg', 7100000, 0),
(159, 42, 'Vàng', '64GB', 9, '1684340769222Vang.jpg', 7200000, 0),
(160, 42, 'Vàng', '128GB', 5, '1684340769222Vang.jpg', 7500000, 0),
(161, 43, 'Đen', '128GB', 17, '1684341078062Đen.jpg', 7000000, 0),
(162, 43, 'Đen', '64GB', 15, '1684341078062Đen.jpg', 7100000, 0),
(163, 43, 'Vàng', '64GB', 10, '1684341109422Vang.jpg', 7500000, 0),
(164, 43, 'Vàng', '128GB', 5, '1684341109422Vang.jpg', 7800000, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` int(255) NOT NULL DEFAULT 0,
  `reason` text DEFAULT NULL,
  `orderDate` datetime NOT NULL DEFAULT current_timestamp(),
  `shipping_address` varchar(255) NOT NULL,
  `shipping_method` text NOT NULL,
  `payment_method` text NOT NULL DEFAULT 'Thanh toán khi nhận hàng',
  `total_amount` int(11) NOT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `id_user`, `fullname`, `phone`, `status`, `reason`, `orderDate`, `shipping_address`, `shipping_method`, `payment_method`, `total_amount`, `note`) VALUES
(30, 30, 'Tùng Lê', '(+84) 373984007', 2, NULL, '2023-05-12 01:53:43', 'Xóm Tân Mĩ 1 xã Tân Quang Thành Phố Sông Công Tỉnh THái Nguyên', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 29000000, 'Đóng gói hàng cẩn thận'),
(31, 33, 'Nguyễn Yến', '0334357515', 1, NULL, '2023-05-17 16:33:02', 'Số nhà 32 Phường Tân Thành, Thành Phố Thái Nguyên', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 38000000, 'Giao hàng sau 10h trưa'),
(32, 33, 'Nguyễn Yến', '0915460676', 1, NULL, '2023-05-17 16:36:26', 'Số nhà 32 Phường Tân Thành, Thành phố Thái Nguyên', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 41600000, 'Giao hàng sau 16h'),
(33, 37, 'Hải Tiên', '0915460999', 1, NULL, '2023-05-17 16:38:48', 'Số nhà 12, ngách 2 ngõ 34 đường Võ Chí Công, Hà Nội', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 26300000, ''),
(34, 35, 'Nguyễn Thi Thu Trang', '0915460676', -2, NULL, '2023-05-17 16:43:57', 'Số nhà 34 ngõ 21 đường Vạn Xuân, Kim Chung Hoài đức, Hà Nội', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 27900000, ''),
(35, 34, 'Quỳnh Anh', '(+84) 373984007', 1, NULL, '2023-05-17 16:45:45', 'Thái Nguyên', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 53600000, ''),
(36, 34, 'Quỳnh Anh', '0915460676', 1, NULL, '2023-05-18 16:07:54', 'Xóm Tân Mĩ 1', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 8500000, 'Giao hàng sau 17h'),
(37, 34, 'Tùng Lê', '(+84) 37398400788', -2, 'Số điện thoại không hợp lệ', '2023-05-19 07:52:40', 'Xóm Tân Mĩ 1, xã Tân Quang, thành phố Sông Công', 'Giao hàng tận nơi', 'Thanh toán khi nhận hàng', 4100000, 'Giao hfng sau 14h');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `id_filter` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `order_detail`
--

INSERT INTO `order_detail` (`id`, `id_order`, `id_filter`, `quantity`) VALUES
(71, 30, 30, 2),
(72, 31, 105, 2),
(73, 32, 42, 4),
(74, 33, 82, 1),
(75, 34, 95, 1),
(76, 35, 91, 2),
(77, 36, 116, 1),
(78, 37, 154, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `producer`
--

CREATE TABLE `producer` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `producer`
--

INSERT INTO `producer` (`id`, `name`) VALUES
(1, 'iPhone'),
(2, 'SAMSUNG'),
(3, 'OPPO'),
(4, 'XIAOMI'),
(5, 'VIVO'),
(6, 'Realme'),
(7, 'NOKIA');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `information` text DEFAULT NULL,
  `priceRange` int(11) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `star` float DEFAULT 5,
  `id_owner` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `createAt` date DEFAULT current_timestamp(),
  `updateAt` date DEFAULT current_timestamp(),
  `deleted` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `information`, `priceRange`, `status`, `img`, `star`, `id_owner`, `id_category`, `createAt`, `updateAt`, `deleted`) VALUES
(26, 'Samsung Galaxy S21', 'Samsung Galaxy S21 ', 'Mới, đầy đủ phụ kiện từ nhà sản xuất', 12000000, 'Mới 100%', '1684316878989VangHong.jpg', 5, 2, 2, '2023-05-10', '2023-05-10', 0),
(28, 'iPhone 11 Chính hãng VN/A', 'Màu sắc phù hợp cá tính - 6 màu sắc bắt mắt để lựa chọn\nHiệu năng mượt mà, ổn định - Chip A13, RAM 4GB\nBắt trọn khung hình - Camera kép hỗ trợ góc rộng, chế độ Night Mode\nYên tâm sử dụng - Kháng nước, kháng bụi IP68, kính cường lực Gorilla Glass', 'Thân máy, cáp USB-C to Lightning, sách HDSD', 11000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684229890389Trang.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(29, 'iPhone 12 Chính hãng VN/A', 'Mạnh mẽ, siêu nhanh với chip A14, RAM 4GB, mạng 5G tốc độ cao\nRực rỡ, sắc nét, độ sáng cao - Màn hình OLED cao cấp, Super Retina XDR hỗ trợ HDR10, Dolby Vision\nChụp đêm ấn tượng - Night Mode cho 2 camera, thuật toán Deep Fusion, Smart HDR 3\nBền bỉ vượt trội - Kháng nước, kháng bụi IP68, mặt lưng Ceramic Shield', 'Thân máy, cáp USB-C to Lightning, sách HDSD', 14000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684230618140Đen.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(30, 'iPhone 12 Pro Chính hãng VN/A', 'Mạnh mẽ, siêu nhanh với chip A14, RAM 6GB, mạng 5G tốc độ cao\nRực rỡ, sắc nét, độ sáng cao - Màn hình OLED cao cấp, Super Retina XDR hỗ trợ HDR10, Dolby Vision\nChụp ảnh siêu đỉnh - Night Mode , thuật toán Deep Fusion, Smart HDR 3, camera LiDar\nBền bỉ vượt trội - Kháng nước, kháng bụi IP68, mặt lưng Ceramic Shield', 'Thân máy, cáp USB-C to Lightning, sách HDSD', 22000000, 'Máy mới 100% , chính hãng Apple Việt Nam', '1684231088155Vang.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(31, 'iPhone 12 Pro Max Chính hãng VN/A', 'Mạnh mẽ, siêu nhanh với chip A14, RAM 6GB, mạng 5G tốc độ cao\nRực rỡ, sắc nét, độ sáng cao - Màn hình OLED cao cấp, Super Retina XDR hỗ trợ HDR10, Dolby Vision\nChụp ảnh siêu đỉnh - Night Mode , thuật toán Deep Fusion, Smart HDR 3, camera LiDar\nBền bỉ vượt trội - Kháng nước, kháng bụi IP68, mặt lưng Ceramic Shield', 'Thân máy, cáp USB-C to Lightning, sách HDSD', 24000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684231485116Trang.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(32, 'iPhone 14 Pro Max  Chính hãng VN/A', 'Màn hình Dynamic Island - Sự biến mất của màn hình tai thỏ thay thế bằng thiết kế viên thuốc, OLED 6,7 inch, hỗ trợ always-on display\nCấu hình iPhone 14 Pro Max mạnh mẽ, hiệu năng cực khủng từ chipset A16 Bionic\nLàm chủ công nghệ nhiếp ảnh - Camera sau 48MP, cảm biến TOF sống động\nPin liền lithium-ion kết hợp cùng công nghệ sạc nhanh cải tiến', 'Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C', 26000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684248750072Den.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(33, 'iPhone 13 Chính hãng VN/A', 'Hiệu năng vượt trội - Chip Apple A15 Bionic mạnh mẽ, hỗ trợ mạng 5G tốc độ cao\nKhông gian hiển thị sống động - Màn hình 6.1\" Super Retina XDR độ sáng cao, sắc nét\nTrải nghiệm điện ảnh đỉnh cao - Camera kép 12MP, hỗ trợ ổn định hình ảnh quang học\nTối ưu điện năng - Sạc nhanh 20 W, đầy 50% pin trong khoảng 30 phút', ' cáp USB-C sang Lightning', 17000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684249440262Hong.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(34, 'iPhone XR Chính hãng VN/A', 'Thiết kế cao cấp tinh tế - 2 mặt kính, khung viền kim loại\nHình ảnh sắc nét, màu sắc chân thực với màn hình Retina, công nghệ True Tone.\nChơi game thả ga với chip A12 Bionic 6 nhân, RAM 3GB\nÂm thanh lớn, sống động với 2 loa kép\nChụp ảnh xóa phông chuyên nghiệp chỉ với 1 camera đơn 12MP', 'Thân máy, cáp USB-C to Lightning, sách HDSD', 9000000, 'Máy mới 100% , chính hãng Apple Việt Nam.', '1684249895968Cam.jpg', 5, 1, 1, '2023-05-16', '2023-05-16', 0),
(35, 'Samsung Galaxy S22 Ultra', 'Vi xử lý mạnh mẽ nhất Galaxy - Snapdragon 8 Gen 1 (4 nm)\nCamera mắt thần bóng đêm Nightography - Chụp đêm cực đỉnh\nS Pen đầu tiên trên Galaxy S - Độ trễ thấp, dễ thao tác\nDung lượng pin bất chấp ngày đêm - Viên pin 5000mAh, sạc nhanh 45W', 'Máy, Sách hướng dẫn, Bút cảm ứng, Cây lấy sim, Cáp Type C', 18000000, 'Máy mới 100%', '1684250600630Trang.jpg', 5, 2, 2, '2023-05-16', '2023-05-16', 0),
(36, 'Samsung Galaxy Z Flip4', 'Ngoại hình thời trang - cầm nắm cực sang với thiết kế gập vỏ sò độc đáo\nCông nghệ màn hình hàng đầu đến từ Samsung - 6.7 inch, tấm nền Dynamic AMOLED 2X\nTrang bị camera chất lượng - Bộ đôi camera có cùng độ phân giải 12 MP, chống rung, chụp đêm\nHiệu năng mạnh mẽ đến từ dòng chip cao cấp của Qualcomm - Snapdragon 8+ Gen 1', 'Đầy đủ phụ kiện từ nhà sản xuất', 19000000, 'Mới 100%', '1684250959847Tim.jpg', 5, 2, 2, '2023-05-16', '2023-05-16', 0),
(37, 'Samsung Galaxy Z Fold4', 'Camera mắt thần bóng đêm cho trải nghiệm chụp ảnh ấn tượng - Camera chính: 50MP\nKhai mở trải nghiệm di động linh hoạt biến hóa - Màn hình ngoài 6.2\"\" cùng màn hình chính 7.6\"\" độc đáo\nHiệu năng mạnh mẽ đến từ dòng chip cao cấp của Qualcomm - Snapdragon 8 Plus Gen 1\nViên pin ấn tượng, sạc nhanh tức tốc - Pin 4,400 mAh, sạc nhanh 25 W', 'Đầy đủ phụ kiện từ nhà sản xuất', 31000000, 'Mới 100%', '1684251258126Kem.jpg', 5, 2, 2, '2023-05-16', '2023-05-16', 0),
(39, 'vivo T1X', 'Bộ vi xử lí mạnh mẽ nói không với giật lag - Qualcomm Snapdragon® 680\nSạc nhanh tức thì, sử dụng dài lâu - Pin lớn 5000mAh, sạc siêu tốc 18W\nRAM Mở Rộng 2.0 - Thoả sức lưu trữ các ứng dụng yêu thích và vận hành mượt mà\nMàn hình sắc nét FHD+ 90Hz sống động mọi hình ảnh', 'Đầy đủ phụ kiện từ nhà sản xuất', 3800000, 'Mới 100%', '1684339936929Xanh.jpg', 5, 5, 2, '2023-05-17', '2023-05-17', 0),
(40, 'vivo V23e', 'Hiển thị chân thực, sống động - Màn hình 6.44\" AMOLED FullHD\nHiệu năng mạnh mẽ vượt trội - Chip MediaTek Helio G96, RAM mở rộng đến 12GB, Android 11 mượt mà\nLàm chủ mọi khung hình - Cụm 3 camera sau lên đến 64MP, camera selfie 50MP\nThiết kế mỏng nhẹ, sang trọng - Mỏng chỉ 7.36mm, nhẹ chỉ 172g, mặt lưng chống bám vân tay', 'Đầy đủ phụ kiện từ nhà sản xuất', 5500000, 'Mới 100%', '1684340246147XanhHong.jpg', 5, 5, 2, '2023-05-17', '2023-05-17', 0),
(41, 'OPPO A57', 'Không gian hiển thị chất lượng - Màn hình IPS LCD 6.56 inches sắc nét\nCấu hình ổn định, thách thức mọi tác vụ - MediaTek Helio G35\nCamera chụp ảnh chuyên nghiệp - Cụm camera 13 MP, đa dạng chế độ và filter\nNăng lượng bất tận - Dung lượng pin 5000 mAh, sạc nhanh 33W', 'Đầy đủ phụ kiện từ nhà sản xuất', 4000000, 'Mới 100%', '1684340549154Xanh.jpg', 5, 3, 2, '2023-05-17', '2023-05-17', 0),
(42, 'OPPO Reno8', 'Chuyên gia chân dung, bừng sáng khoảnh khắc đêm - Cụm camera 64MP + 2MP + 2MP hiện đại\nDẫn đầu xu hướng nhờ thiết kế tinh xảo, cao cấp và mỏng nhẹ, phù hợp với trải nghiệm hàng ngày\nSạc nhanh siêu tốc, tràn đầy năng lượng cho cả ngày - Viên pin 4500mAh, Sạc nhanh siêu tốc 33W\nGấp đôi hiệu suất, xử lí mọi tác vụ - Con chip Qualcomm Snapdragon 680 mạnh mẽ trong phân khúc', 'Đầy đủ phụ kiện từ nhà sản xuất', 7000000, 'Mới 100%', '1684340787677Vang.jpg', 5, 3, 2, '2023-05-17', '2023-05-17', 0),
(43, 'OPPO Reno8 Z', 'Chuyên gia chân dung, toả sáng khoảnh khắc đêm - Cụm camera 64MP + 2MP + 2MP nhiều tính năng tiện ích\nThiết kế tinh xảo, cao cấp và mỏng nhẹ, phù hợp với trải nghiệm hàng ngày\nSạc nhanh siêu tốc, tràn đầy năng lượng cho cả ngày - Viên pin 4500mAh, Sạc nhanh siêu tốc 33W\nGấp đôi hiệu suất, xử lí mọi tác vụ - Con chip Qualcomm Snapdragon 695 mạnh mẽ trong phân khúc', 'Đầy đủ phụ kiện từ nhà sản xuất', 7500000, 'Mới 100%', '1684341121997Vang.jpg', 5, 3, 2, '2023-05-17', '2023-05-17', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT 'default.jpg',
  `birthday` date DEFAULT NULL,
  `gender` int(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `createAt` date NOT NULL DEFAULT current_timestamp(),
  `updateAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `username`, `avatar`, `birthday`, `gender`, `isAdmin`, `deleted`, `createAt`, `updateAt`) VALUES
(26, 'user123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$vrRSzfBSzWRBJ84gZA35wQ$KGKkrhtAz5NySeNlg8QptvwwWME5YLptc/MGXV69Wq0', 'Test Admin', '', '0000-00-00', NULL, 0, 0, '2023-03-14', '2023-03-14'),
(27, 'admin@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$QWAQyduEQQIKtxKJ7xywNA$Hxg1o/ZPxWzc4GCSagSPKzr9O0hDV331/wBFxhxFYHU', 'Summer', '', '0000-00-00', NULL, 0, 0, '2023-03-14', '2023-03-14'),
(28, 'admin123@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$owY+iWZTvqDDB99DakblCg$ldHc71iQiB93bD0ms/xH7pgA4Z/UnFg9EBJoeY+DOs0', 'Update chính mình', '', '0000-00-00', NULL, 0, 0, '2023-03-14', '2023-03-14'),
(29, 'admin1234@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$tsN4FbIuHaLTVUAJSds4OQ$m2vegZhVnYPIsrfoThwnKp3g1KbatTSq24bsx2C2kVA', 'Test Admin 366', '', '0000-00-00', NULL, 0, 0, '2023-03-14', '2023-03-14'),
(30, 'admin12345@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$KXN+9HNWer+mFz9BVSd2BQ$qKdOYn6crSbpTfxWxwE/LgzTD/yJzB7+QbASFpgWXEc', 'myAdmin', '1683856638445f44ee27b82fd58a301ec1.jpg', '1997-11-21', 2, 1, 0, '2023-03-14', '2023-03-14'),
(31, 'user@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$YWZySH/liPyMOdd8wJCumQ$/uMXq3w7hbgPVXJrERO8hCJa/qEVQQCZVaQ4HpPbWrU', 'user name', '', '0000-00-00', NULL, 0, 0, '2023-03-21', '2023-03-21'),
(32, 'usertest@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$ujSEP/B5rzWmma4LiXe6Rw$w2W1faSOZSN/ENKISdS0T5BtOF0MNUia4G7ezL1e7sI', 'test', '', '0000-00-00', NULL, 0, 0, '2023-04-05', '2023-04-05'),
(33, 'nguyenyen@gmaiil.com', '$argon2id$v=19$m=65536,t=3,p=4$ENI+GDbnJ8YFnAAvkbN9JQ$3gZ25Neu6NKSwRbqb5FQKd+ZYkZnVPe4c33COzlQGGU', 'Nguyen Yen', '', NULL, NULL, 0, 0, '2023-04-08', '2023-04-08'),
(34, 'daoquynanh@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$5RV4vPnt7SuF/0DjLVymOg$qfKdDwPCcCo0jqqydlilTYUXbjtD6+3t4DuAthk25DY', 'Đào Quỳnh Anh', '1681403376147f44ee27b82fd58a301ec1.jpg', '2023-04-16', 2, 0, 0, '2023-04-08', '2023-04-08'),
(35, 'sunflower@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$8U76gPLs5a/URPzWH0nrBg$r8bAZPR7iE4zctZv71TXRFj3fey4qsiBVt5iltuNXaw', 'Sunflower', 'default.jpg', '2002-11-14', 1, 0, 0, '2023-04-13', '2023-04-13'),
(37, 'haitien@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$/EOcQt9SslOrB3P2ZGkhyA$+s3U+oebcl2LDw4VfsBvoA3bRfxXm86n706FsBnLcbI', 'Hải Tiến', 'default.jpg', NULL, NULL, 0, 0, '2023-04-14', '2023-04-14'),
(38, 'levantung14112002@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$9G54ts6yleCxB5MQA0iOWg$pHdoP4/727/rTnGQNrMReM8fSxS/CVK3v3vnBbpP18s', 'ĐQ.Anh', 'default.jpg', NULL, NULL, 0, 0, '2023-04-24', '2023-04-24');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_user` (`id_user`),
  ADD KEY `cart_filter` (`id_filter`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `filter`
--
ALTER TABLE `filter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `filter_ibfk_1` (`id_pro`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_user` (`id_user`);

--
-- Chỉ mục cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `details_orders` (`id_order`),
  ADD KEY `details_fillter` (`id_filter`);

--
-- Chỉ mục cho bảng `producer`
--
ALTER TABLE `producer`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_ibfk_2` (`id_category`),
  ADD KEY `pro_producer` (`id_owner`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `filter`
--
ALTER TABLE `filter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT cho bảng `producer`
--
ALTER TABLE `producer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_filter` FOREIGN KEY (`id_filter`) REFERENCES `filter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `filter`
--
ALTER TABLE `filter`
  ADD CONSTRAINT `filter_ibfk_1` FOREIGN KEY (`id_pro`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `order_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `details_fillter` FOREIGN KEY (`id_filter`) REFERENCES `filter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `details_orders` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `pro_producer` FOREIGN KEY (`id_owner`) REFERENCES `producer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
