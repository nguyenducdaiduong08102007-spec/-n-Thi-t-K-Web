# Đưa API lên Netlify

Netlify Drop chỉ đăng các tệp tĩnh; nó không chạy `server.ps1`. Cấu hình này giữ trang web trên Netlify, chạy API bằng Netlify Functions và lưu dữ liệu trong Supabase. Mật khẩu quản trị và khóa Supabase chỉ được đặt trong Environment variables của Netlify, không đưa vào HTML, JavaScript phía trình duyệt hoặc Git.

## 1. Tạo cơ sở dữ liệu Supabase

1. Tạo project tại [supabase.com](https://supabase.com).
2. Mở **SQL Editor**, tạo query mới, dán toàn bộ nội dung `supabase/schema.sql` rồi bấm **Run**.
3. Trong **Project Settings → API**, ghi lại **Project URL** và **service_role key**. Chỉ dùng key này làm biến môi trường bí mật trên Netlify; không gửi key qua chat và không đặt key vào file trong project.

## 2. Cấu hình biến môi trường trên Netlify

Trong site settings, mở **Environment variables** và thêm:

| Tên | Giá trị |
| --- | --- |
| `SUPABASE_URL` | Project URL ở bước 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key ở bước 1 |
| `THEOCEAN_ADMIN_EMAIL` | Email dùng để đăng nhập admin |
| `THEOCEAN_ADMIN_PASSWORD` | Mật khẩu riêng, tối thiểu 12 ký tự |
| `THEOCEAN_SESSION_SECRET` | Chuỗi ngẫu nhiên, tối thiểu 32 ký tự |
| `THEOCEAN_RATE_LIMIT_SECRET` | Một chuỗi ngẫu nhiên khác, tối thiểu 32 ký tự |

Có thể tạo hai chuỗi secret ngẫu nhiên trong PowerShell bằng lệnh sau; giữ chúng riêng tư:

```powershell
$rng = [Security.Cryptography.RandomNumberGenerator]::Create()
1..2 | ForEach-Object {
    $bytes = New-Object byte[] 48
    $rng.GetBytes($bytes)
    [Convert]::ToBase64String($bytes)
}
$rng.Dispose()
```

Không dùng lại mật khẩu tài khoản Netlify/Supabase. Không đặt các biến bí mật ở scope `Functions` bị giới hạn sai môi trường; để dùng cho Production và Deploy Previews nếu cần kiểm tra cả hai.

## 3. Deploy Functions

Các Netlify Functions không được đưa lên bằng cách chỉ kéo-thả thư mục như bản preview tĩnh trước đó. Cài Node.js LTS nếu máy chưa có Node.js, rồi mở PowerShell tại thư mục gốc `C:\TheOcean` và chạy:

```powershell
npm install --global netlify-cli
netlify login
netlify link
netlify deploy --build --prod --dir .
```

Ở `netlify link`, chọn site `cute-arithmetic-9742f0` hiện tại. Nếu CLI hỏi xác nhận deploy, chọn site đó. Mỗi lần sửa code, chạy lại lệnh deploy cuối. Nếu muốn dùng GitHub để tự deploy, kết nối repo trong Netlify; giữ `netlify.toml` ở thư mục gốc.

Sau khi thêm hoặc sửa Environment variables, deploy lại để Functions nhận cấu hình mới.

## 4. Kiểm tra

- Trang chính: `https://cute-arithmetic-9742f0.netlify.app/`
- Admin: `https://cute-arithmetic-9742f0.netlify.app/html/admin.html`
- Gửi thử một yêu cầu tư vấn; sau đó đăng nhập admin để kiểm tra danh sách.
- Đăng nhập bằng `THEOCEAN_ADMIN_EMAIL` và `THEOCEAN_ADMIN_PASSWORD`.

Nếu có lỗi, xem **Netlify → Functions → api → Logs**. Không gửi `service_role` key, session secret hay mật khẩu trong ảnh/log công khai.

## Lưu ý

- Chỉ người biết email và mật khẩu admin mới vào được dashboard; không chia sẻ thông tin đăng nhập.
- Netlify Functions dùng cookie `HttpOnly`, `Secure`, `SameSite=Strict`, hết hạn sau 8 giờ. Đăng nhập bị giới hạn 5 lần mỗi 15 phút theo địa chỉ IP; gửi form đăng ký bị giới hạn 5 lần mỗi 10 phút.
- Đăng ký và doanh thu được lưu trong Supabase, không còn lưu trong tệp JSON trên máy cá nhân. Sao lưu dữ liệu Supabase định kỳ.
- `server.ps1` vẫn dùng cho chạy local; nó không phải backend production trên Netlify.
