<?php

namespace Database\Seeders;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Seeder;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user or create one
        $user = User::first();

        if (! $user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create sample notes
        $sampleNotes = [
            [
                'title' => 'Proje Fikirleri',
                'content' => 'Web uygulaması için yeni özellikler: kullanıcı dashboard\'u, bildirim sistemi, dosya yükleme modülü. Ayrıca mobile uygulama versiyonu için araştırma yapmak gerekiyor. React Native veya Flutter seçeneklerini değerlendirmeli.',
                'tags' => ['iş', 'proje', 'web'],
                'is_important' => true,
                'is_favorite' => true,
            ],
            [
                'title' => 'Market Listesi',
                'content' => '• Süt ve peynir\n• Ekmek\n• Domates, salatalık\n• Tavuk eti\n• Yumurta\n• Çay ve kahve\n• Deterjan\n• Kağıt havlu',
                'tags' => ['kişisel', 'alışveriş'],
                'is_important' => false,
                'is_favorite' => false,
            ],
            [
                'title' => 'Kitap Notları - Atomic Habits',
                'content' => '"Atomic Habits" kitabından önemli noktalar:\n\n1. Küçük değişiklikler büyük sonuçlar doğurur\n2. Habit stacking tekniği çok etkili\n3. Çevreyi düzenlemek alışkanlık oluşturmayı kolaylaştırır\n4. 1% her gün daha iyi olmak yılda %37 gelişim demek\n\nImplementasyon örnekleri:\n- Sabah kalktığında hemen kitap okumak\n- Egzersiz yapmadan önce kıyafetleri hazırlamak',
                'tags' => ['eğitim', 'kitap', 'kişisel gelişim'],
                'is_important' => true,
                'is_favorite' => true,
            ],
            [
                'title' => 'Toplantı Notları - Sprint Planlama',
                'content' => 'Sprint planlama toplantısı (15 Mart 2024)\n\nKararlar:\n- Backend API geliştirmeleri tamamlanacak\n- Frontend bileşenleri revize edilecek\n- Test senaryoları yazılacak\n- Database optimizasyonu yapılacak\n\nSorumlu: Ahmet (Backend), Ayşe (Frontend), Mehmet (Test)\nDeadline: 30 Mart 2024',
                'tags' => ['iş', 'toplantı', 'sprint'],
                'is_important' => true,
                'is_favorite' => false,
            ],
            [
                'title' => 'Tatil Planları',
                'content' => 'Yaz tatili için araştırmalar:\n\n1. Kaş-Kalkan bölgesi\n2. Bodrum-Gümüslük\n3. Çeşme-Alaçatı\n\nBütçe: 15.000-20.000 TL\nTarih: Temmuz ayı ilk 2 haftası\nKonaklama: Butik otel veya villa kiralama\n\nNot: Erken rezervasyon indirimleri var, en geç Nisan sonuna kadar karar vermeli.',
                'tags' => ['kişisel', 'tatil', 'plan'],
                'is_important' => false,
                'is_favorite' => true,
            ],
            [
                'title' => 'Egzersiz Rutini',
                'content' => 'Haftalık egzersiz programı:\n\nPazartesi: Üst vücut (45 dk)\nSalı: Kardiyo (30 dk)\nÇarşamba: Alt vücut (45 dk)\nPerşembe: Dinlenme\nCuma: Full body (60 dk)\nCumartesi: Yürüyüş/Bisiklet\nPazar: Yoga/Stretching\n\nHedef: 3 ay sonunda 5 kg kilo vermek\nMevcut kilo: 75 kg\nHedef kilo: 70 kg',
                'tags' => ['sağlık', 'egzersiz', 'hedef'],
                'is_important' => false,
                'is_favorite' => false,
                'is_archived' => true,
            ],
        ];

        foreach ($sampleNotes as $noteData) {
            Note::create([
                'user_id' => $user->id,
                'title' => $noteData['title'],
                'content' => $noteData['content'],
                'tags' => $noteData['tags'],
                'is_important' => $noteData['is_important'] ?? false,
                'is_favorite' => $noteData['is_favorite'] ?? false,
                'is_archived' => $noteData['is_archived'] ?? false,
            ]);
        }
    }
}
