# Wedding Invitation Website - Anindias & Fachry

Sebuah website undangan pernikahan yang elegan dan modern dengan desain mobile-first, menampilkan countdown timer, RSVP form, galeri foto, dan berbagai fitur menarik lainnya.

## 🌟 Fitur Utama

### ✨ Fitur Inti
- **Desain Mobile-First**: Dioptimalkan untuk tampilan mobile dengan layout yang responsif
- **Countdown Timer**: Hitungan mundur real-time menuju hari pernikahan (24 Desember 2025)
- **RSVP System**: Form konfirmasi kehadiran dengan opsi hadir/tidak hadir/mungkin hadir
- **Save the Date**: Informasi tanggal dan venue pernikahan
- **Peta Lokasi**: Integrasi dengan Google Maps untuk navigasi ke venue
- **Background Music**: Pemutar musik latar dengan kontrol play/pause dan volume

### 🎨 Fitur Tambahan
- **Photo Gallery**: Galeri foto perjalanan cinta dengan modal view
- **Wedding Timeline**: Jadwal acara pernikahan dari siang hingga malam
- **Gift Registry**: Daftar hadiah dan informasi rekening untuk kado
- **Dress Code**: Panduan berpakaian dengan palet warna yang disarankan
- **Accommodation**: Rekomendasi hotel dan akomodasi untuk tamu
- **Theme Switcher**: 4 tema warna yang dapat dipilih (Elegant Dark, Romantic Blush, Golden Luxury, Forest Elegance)

### 🔧 Fitur Teknis
- **Mobile Layout Enforcement**: Layout mobile bahkan saat diakses dari desktop
- **Smooth Navigation**: Navigasi halus dengan scroll animation
- **Theme Persistence**: Preferensi tema tersimpan di browser
- **Responsive Design**: Tampilan optimal di berbagai ukuran layar
- **Real-time Updates**: Data RSVP dan statistik yang update real-time

## 🛠 Tech Stack

### Frontend
- **React 19** - Library JavaScript untuk UI
- **Tailwind CSS** - Framework CSS untuk styling
- **Shadcn/UI** - Komponen UI modern dan accessible
- **Lucide React** - Icon library
- **React Router DOM** - Routing untuk SPA
- **Axios** - HTTP client untuk API calls

### Backend
- **FastAPI** - Framework Python untuk REST API
- **MongoDB** - Database NoSQL untuk menyimpan data
- **Motor** - Driver MongoDB async untuk Python
- **Pydantic** - Validasi data dan serialization
- **Python-dotenv** - Manajemen environment variables

### Tools & Services
- **Yarn** - Package manager untuk frontend
- **Supervisor** - Process manager untuk production
- **CORS Middleware** - Cross-origin resource sharing
- **Docker** - Containerization (opsional)

## 📋 Requirements

### Sistem Minimum
- **Node.js** >= 18.0.0
- **Python** >= 3.8
- **MongoDB** >= 4.4
- **Yarn** >= 1.22.0
- **Git** untuk version control

### Dependencies Frontend
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^3.4.17",
  "axios": "^1.8.4",
  "react-router-dom": "^7.5.1",
  "lucide-react": "^0.507.0"
}
```

### Dependencies Backend
```txt
fastapi==0.110.1
uvicorn==0.25.0
motor==3.3.1
pymongo==4.5.0
python-dotenv>=1.0.1
pydantic>=2.6.4
```

## 🚀 Instalasi & Deployment Lokal

### 1. Clone Repository
```bash
git clone <repository-url>
cd wedding-invitation
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

pip install -r requirements.txt
```

### 3. Setup Frontend
```bash
cd frontend
yarn install
```

### 4. Environment Variables
Buat file `.env` di folder `backend`:
```env
MONGO_URL=mongodb://localhost:27017/wedding_db
DB_NAME=wedding_db
```

Buat file `.env` di folder `frontend`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 5. Jalankan MongoDB
```bash
# Menggunakan Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Atau install MongoDB lokal
# Ikuti panduan instalasi MongoDB untuk OS Anda
```

### 6. Jalankan Aplikasi
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend
yarn start
```

### 7. Akses Aplikasi
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

## 🌐 Deployment ke VPS

### Rekomendasi VPS Provider: DeluxHost

Untuk deployment yang optimal, kami merekomendasikan **DeluxHost VPS STANDARD - VPS-3** dengan spesifikasi:
- **2 CPU Cores**
- **4 GB RAM**
- **60 GB SSD Storage**
- **Unlimited Bandwidth**
- **Linux Ubuntu/CentOS**

**👉 [Dapatkan VPS DeluxHost dengan link referral ini](https://billing.deluxhost.net/aff.php?aff=255)**

Paket VPS-3 sangat cocok untuk aplikasi wedding invitation dengan traffic menengah dan performa yang stabil.

### 1. Setup VPS
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl git nginx supervisor

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.8+
sudo apt install -y python3 python3-pip python3-venv

# Install Yarn
npm install -g yarn

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 2. Deploy Aplikasi
```bash
# Clone repository
cd /var/www
sudo git clone <repository-url> wedding-invitation
sudo chown -R $USER:$USER /var/www/wedding-invitation
cd wedding-invitation

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
yarn install
yarn build
```

### 3. Konfigurasi Environment
```bash
# Backend .env
cd /var/www/wedding-invitation/backend
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017/wedding_db
DB_NAME=wedding_db
EOF

# Frontend .env (untuk build)
cd ../frontend
cat > .env << EOF
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF

# Rebuild frontend dengan domain yang benar
yarn build
```

### 4. Setup Supervisor
```bash
# Konfigurasi Supervisor untuk Backend
sudo cat > /etc/supervisor/conf.d/wedding-backend.conf << EOF
[program:wedding-backend]
command=/var/www/wedding-invitation/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
directory=/var/www/wedding-invitation/backend
user=www-data
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/wedding-backend.log
EOF

# Restart supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start wedding-backend
```

### 5. Setup Nginx
```bash
# Konfigurasi Nginx
sudo cat > /etc/nginx/sites-available/wedding-invitation << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        root /var/www/wedding-invitation/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files
    location /static {
        root /var/www/wedding-invitation/frontend/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/wedding-invitation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL dengan Let's Encrypt (Opsional)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Tambahkan baris ini:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Setup Firewall
```bash
# Setup UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📁 Struktur Proyek

```
wedding-invitation/
├── backend/
│   ├── server.py          # Main FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts (Theme)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions & mock data
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── .env            # Frontend environment variables
└── README.md           # Dokumentasi proyek
```

## 🎯 Fitur Khusus

### Mobile-Only Layout
Website ini dirancang khusus untuk pengalaman mobile. Bahkan ketika diakses dari desktop, layout akan tetap dalam format mobile (430px width) dengan background yang elegan.

### Theme System
4 tema warna yang tersedia:
1. **Elegant Dark** - Gelap dan sophisticated
2. **Romantic Blush** - Soft dan romantic
3. **Golden Luxury** - Mewah dan hangat
4. **Forest Elegance** - Natural dan elegant

### RSVP System
Sistem RSVP dengan fitur:
- Konfirmasi kehadiran (Hadir/Tidak Hadir/Mungkin)
- Jumlah tamu yang akan dibawa
- Informasi dietary restrictions
- Pesan khusus untuk pasangan
- Statistik real-time jumlah konfirmasi

## 🔧 Kustomisasi

### Mengganti Informasi Pernikahan
Edit file `/frontend/src/utils/mockData.js` untuk mengubah:
- Nama pasangan
- Tanggal pernikahan
- Informasi venue
- Data RSVP sample

### Mengganti Tema Warna
Edit file `/frontend/src/contexts/ThemeContext.js` untuk:
- Menambah tema baru
- Mengubah palet warna existing
- Mengatur tema default

### Menambah Fitur Baru
1. Buat komponen baru di `/frontend/src/components/`
2. Import ke `/frontend/src/pages/WeddingInvitation.js`
3. Tambahkan navigation item jika diperlukan

## 🐛 Troubleshooting

### Frontend tidak dapat terhubung ke Backend
- Pastikan REACT_APP_BACKEND_URL benar di `.env`
- Cek apakah backend berjalan di port 8001
- Periksa CORS settings di backend

### MongoDB connection error
- Pastikan MongoDB service berjalan
- Cek MONGO_URL di backend `.env`
- Verifikasi database name dan permissions

### Build error saat deployment
- Pastikan semua dependencies terinstall
- Cek versi Node.js dan Python
- Review error logs di supervisor

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- Buat issue di repository ini
- Contact: anindias.fachry@wedding.com

## 📄 License

MIT License - Bebas digunakan dan dimodifikasi untuk keperluan personal dan komersial.

---

**Made with ❤️ for Anindias & Fachry's Wedding**

*Deployment terbaik dengan [DeluxHost VPS-3](https://billing.deluxhost.net/aff.php?aff=255) - Performa optimal, harga terjangkau!*
