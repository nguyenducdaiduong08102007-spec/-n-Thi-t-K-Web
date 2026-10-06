# Chạy The Ocean Gym

Trang web và bảng điều khiển quản trị được phục vụ bởi cùng một tiến trình PowerShell. Cách này giúp API dùng chung nguồn với trang web và tránh lưu mã phiên quản trị trong bộ nhớ trình duyệt.

## Yêu cầu

- Windows PowerShell 5.1 trở lên
- Trình duyệt hiện đại được hỗ trợ

## Chạy trên máy cá nhân

Mở PowerShell tại thư mục gốc của dự án và thiết lập tài khoản quản trị riêng trước khi khởi động máy chủ:

```powershell
$env:THEOCEAN_ADMIN_EMAIL = "your-admin@example.com"
$securePassword = Read-Host "Nhập mật khẩu quản trị (ít nhất 12 ký tự)" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $env:THEOCEAN_ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Mở <http://127.0.0.1:8080/>. Khi chạy lần đầu, máy chủ tạo tệp `%LOCALAPPDATA%\TheOceanGym\theocean-data.json`. Các yêu cầu đăng ký và khoản doanh thu được lưu trong tệp này, bên ngoài thư mục web. Hãy sao lưu tệp một cách an toàn và không công khai tệp. Nếu muốn chọn thư mục lưu trữ riêng khác, hãy đặt biến `THEOCEAN_DATA_DIRECTORY` trước khi khởi động máy chủ.

Biểu mẫu đăng ký thu thập họ tên, số điện thoại Việt Nam và mục tiêu tập luyện không bắt buộc. Đăng ký mới sẽ xuất hiện trong bảng điều khiển quản trị. Quản trị viên có thể ghi nhận doanh thu; số liệu được chia theo tháng hiện tại và năm tháng trước đó.

## Lưu ý khi triển khai

Máy chủ tích hợp chỉ lắng nghe tại `127.0.0.1`. Máy chủ được thiết kế để chạy trên máy cá nhân hoặc phía sau một reverse proxy HTTPS đáng tin cậy. Không mở trực tiếp máy chủ này ra Internet. Môi trường thực tế vẫn cần HTTPS, kiểm soát quyền truy cập ở cấp hệ điều hành, sao lưu tệp dữ liệu và giám sát vận hành. Chỉ đặt `THEOCEAN_ALLOW_NONLOCAL_BIND=1` để cho phép lắng nghe ngoài localhost khi đã có reverse proxy đáng tin cậy bảo vệ dịch vụ; đồng thời đặt `THEOCEAN_BEHIND_HTTPS_PROXY=1` để cookie quản trị có thuộc tính `Secure`.

Thông tin đăng nhập quản trị được đọc từ các biến môi trường khi khởi động máy chủ; không có tài khoản mặc định hay tài khoản mẫu. Phiên đăng nhập là cookie ngẫu nhiên do máy chủ quản lý, chỉ dùng qua HTTP và giới hạn cùng trang; phiên hết hạn sau tám giờ. Giới hạn tần suất và phiên đăng nhập được lưu trong bộ nhớ, nên sẽ được đặt lại khi khởi động lại tiến trình.

Tệp kiểu Tailwind đã được biên dịch sẵn vào `css\tailwind.css`; trang web không tải Tailwind runtime từ CDN. Cấu hình nguồn nằm trong `tailwind.config.js` và `css\tailwind.input.css`. Google Fonts vẫn là dịch vụ phông chữ bên ngoài tùy chọn; hệ thống sẽ dùng phông chữ có sẵn trên máy nếu không tải được.
