// Yaz Tatili Ders Programı JavaScript - JSON Dosyası ile

class StudyProgram {
    constructor() {
        this.days = [
            {
                id: 'monday',
                name: 'Pazartesi',
                icon: 'fas fa-book',
                tasks: [
                    'Türkçe (Konu tekrarı yap + En az 20 soru çöz)',
                    'İngilizce (Kelime tekrarı yap)',
                    'Kitap oku (30 dk)'
                ],
                color: '#FF6B6B'
            },
            {
                id: 'tuesday',
                name: 'Salı',
                icon: 'fas fa-gamepad',
                tasks: [
                    'Dışarıda çıkabilir yada bilgisayar oynayabilirsin',
                    'İstersen güzel bir film izleyebilirsin'
                ],
                color: '#4ECDC4'
            },
            {
                id: 'wednesday',
                name: 'Çarşamba',
                icon: 'fas fa-calculator',
                tasks: [
                    'Matematik (Konu tekrarı yap + En az 20 soru çöz)',
                    'İngilizce (Kelime tekrarı yap)'
                ],
                color: '#45B7D1'
            },
            {
                id: 'thursday',
                name: 'Perşembe',
                icon: 'fas fa-running',
                tasks: [
                    'Spor, egzersiz yap',
                    'Gezip dolaş',
                    'İnternetsiz bir gün geçir',
                    'Yeni oyun geliştir yada var olan oyunu evdekilerle oyna'
                ],
                color: '#96CEB4'
            },
            {
                id: 'friday',
                name: 'Cuma',
                icon: 'fas fa-flask',
                tasks: [
                    'Fen bilimleri (Konu tekrarı yap + En az 20 soru çöz)',
                    'Amcanla satranç oyna, deden yada babanen ile yeni bir oyun geliştir',
                    'İnternet serbest'
                ],
                color: '#FFEAA7'
            },
            {
                id: 'saturday',
                name: 'Cumartesi',
                icon: 'fas fa-globe',
                tasks: [
                    'Sosyal Bilgiler (Konu tekrarı yap - En az 20 soru çöz)',
                    'Merak ettiğin bir konuda bir belgesel izle',
                    'Kitap oku (30 dk)'
                ],
                color: '#DDA0DD'
            },
            {
                id: 'sunday',
                name: 'Pazar',
                icon: 'fas fa-star',
                tasks: [
                    'Bugün özgür bir gün. Lunapark, normal park git, burger yiyebilirsin (annene söylememek kaydıyla)',
                    'Kitap oku'
                ],
                color: '#FFB6C1'
            }
        ];
        
        this.currentDay = null;
        this.modal = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderDays();
        this.setupEventListeners();
        this.modal = new bootstrap.Modal(document.getElementById('dayModal'));
    }

    async loadData() {
        try {
            // JSON dosyasından veri yükle
            const response = await fetch('study_data.json');
            if (response.ok) {
                const serverData = await response.json();
                
                this.days.forEach(day => {
                    if (serverData[day.id]) {
                        day.entries = serverData[day.id].entries || [];
                        day.completed = serverData[day.id].completed || false;
                    } else {
                        day.entries = [];
                        day.completed = false;
                    }
                });
                
                console.log('Veriler JSON dosyasından yüklendi');
            } else {
                console.log('JSON dosyası bulunamadı, boş verilerle başlatılıyor');
                this.initializeEmptyData();
            }
        } catch (error) {
            console.log('Veri yükleme hatası:', error);
            this.initializeEmptyData();
        }
    }

    initializeEmptyData() {
        this.days.forEach(day => {
            day.entries = [];
            day.completed = false;
        });
    }

    async saveData(dayId) {
        const day = this.days.find(d => d.id === dayId);
        if (!day) return;

        // Tüm veriyi topla
        const allData = {};
        this.days.forEach(day => {
            allData[day.id] = {
                entries: day.entries,
                completed: day.completed
            };
        });

        // LocalStorage'a kaydet (geçici çözüm)
        localStorage.setItem('kavicanData', JSON.stringify(allData));
        
        // Kullanıcıya bilgi ver
        this.showNotification('Veriler kaydedildi! (LocalStorage)', 'success');
        
        console.log('Veriler LocalStorage\'a kaydedildi. Farklı browserlarda senkronizasyon için manuel güncelleme gerekli.');
    }

    renderDays() {
        const container = document.getElementById('daysContainer');
        container.innerHTML = '';

        this.days.forEach(day => {
            const dayCard = this.createDayCard(day);
            container.appendChild(dayCard);
        });
    }

    createDayCard(day) {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
        
        const entryCount = day.entries.length;
        const statusClass = day.completed ? 'status-completed' : 'status-pending';
        const statusText = day.completed ? 'Tamamlandı' : 'Bekliyor';

        col.innerHTML = `
            <div class="day-card" data-day-id="${day.id}">
                <div class="day-header">
                    <h3 class="day-name">${day.name}</h3>
                    <i class="day-icon ${day.icon}"></i>
                </div>
                <div class="day-content">
                    <div class="day-tasks">
                        ${day.tasks.slice(0, 2).map(task => `<div>• ${task}</div>`).join('')}
                        ${day.tasks.length > 2 ? `<div class="text-muted">+${day.tasks.length - 2} görev daha...</div>` : ''}
                    </div>
                </div>
                <div class="day-footer">
                    <span class="completion-status ${statusClass}">${statusText}</span>
                    ${entryCount > 0 ? `<span class="entry-count">${entryCount}</span>` : ''}
                </div>
            </div>
        `;

        return col;
    }

    setupEventListeners() {
        // Gün kartlarına tıklama
        document.addEventListener('click', (e) => {
            const dayCard = e.target.closest('.day-card');
            if (dayCard) {
                const dayId = dayCard.dataset.dayId;
                this.openDayModal(dayId);
            }
        });

        // Modal içindeki butonlar
        document.getElementById('addEntryBtn').addEventListener('click', () => {
            this.addEntry();
        });

        // Tamamlama durumu değiştirme
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-completion')) {
                const dayId = this.currentDay;
                this.toggleCompletion(dayId);
            }
        });

        // Günlük kayıt düzenleme ve silme
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-entry')) {
                const entryId = e.target.dataset.entryId;
                this.editEntry(entryId);
            }
            if (e.target.classList.contains('delete-entry')) {
                const entryId = e.target.dataset.entryId;
                this.deleteEntry(entryId);
            }
        });
    }

    openDayModal(dayId) {
        this.currentDay = dayId;
        const day = this.days.find(d => d.id === dayId);
        
        if (!day) return;

        // Modal başlığını güncelle
        document.getElementById('modalTitle').innerHTML = `
            ${day.name} 
            <button class="btn btn-sm toggle-completion ${day.completed ? 'btn-success' : 'btn-warning'} ms-2">
                ${day.completed ? '<i class="fas fa-check"></i> Tamamlandı' : '<i class="fas fa-clock"></i> Bekliyor'}
            </button>
        `;

        // Görevleri göster
        const tasksContainer = document.getElementById('dayTasks');
        tasksContainer.innerHTML = day.tasks.map(task => 
            `<div class="task-item">• ${task}</div>`
        ).join('');

        // Günlük kayıtları göster
        this.renderEntries();

        // Modal'ı aç
        this.modal.show();
    }

    renderEntries() {
        const day = this.days.find(d => d.id === this.currentDay);
        const entriesContainer = document.getElementById('diaryEntries');
        
        if (day.entries.length === 0) {
            entriesContainer.innerHTML = '<p class="text-muted">Henüz kayıt yok. Bugün neler yaptığını yazabilirsin!</p>';
            return;
        }

        entriesContainer.innerHTML = day.entries.map((entry, index) => `
            <div class="diary-entry" data-entry-id="${index}">
                <div class="entry-header">
                    <span class="entry-date">${this.formatDate(entry.timestamp)}</span>
                    <div class="entry-actions">
                        <button class="btn btn-sm btn-warning edit-entry" data-entry-id="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-entry" data-entry-id="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="entry-content">${entry.content}</div>
            </div>
        `).join('');
    }

    addEntry() {
        const textarea = document.getElementById('newEntry');
        const content = textarea.value.trim();
        
        if (!content) {
            alert('Lütfen bir şeyler yaz!');
            return;
        }

        const day = this.days.find(d => d.id === this.currentDay);
        const entry = {
            content: content,
            timestamp: new Date().toISOString()
        };

        day.entries.unshift(entry);
        this.saveData(this.currentDay);
        this.renderEntries();
        this.renderDays(); // Ana sayfadaki kayıt sayısını güncelle

        textarea.value = '';
        
        // Başarı mesajı göster
        this.showNotification('Kayıt başarıyla eklendi!', 'success');
    }

    editEntry(entryId) {
        const day = this.days.find(d => d.id === this.currentDay);
        const entry = day.entries[entryId];
        
        const newContent = prompt('Kaydını düzenle:', entry.content);
        if (newContent !== null && newContent.trim() !== '') {
            entry.content = newContent.trim();
            entry.timestamp = new Date().toISOString(); // Düzenleme zamanını güncelle
            
            this.saveData(this.currentDay);
            this.renderEntries();
            this.showNotification('Kayıt güncellendi!', 'success');
        }
    }

    deleteEntry(entryId) {
        if (confirm('Bu kaydı silmek istediğinden emin misin?')) {
            const day = this.days.find(d => d.id === this.currentDay);
            day.entries.splice(entryId, 1);
            
            this.saveData(this.currentDay);
            this.renderEntries();
            this.renderDays(); // Ana sayfadaki kayıt sayısını güncelle
            this.showNotification('Kayıt silindi!', 'warning');
        }
    }

    toggleCompletion(dayId) {
        const day = this.days.find(d => d.id === dayId);
        day.completed = !day.completed;
        
        this.saveData(dayId);
        this.renderDays();
        this.openDayModal(dayId); // Modal'ı yenile
        
        const status = day.completed ? 'tamamlandı' : 'bekliyor';
        this.showNotification(`${day.name} günü ${status}!`, 'success');
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type = 'info') {
        // Basit bir bildirim sistemi
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    new StudyProgram();
});

// Ek özellikler
document.addEventListener('DOMContentLoaded', () => {
    // Klavye kısayolları
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            const addBtn = document.getElementById('addEntryBtn');
            if (addBtn && !addBtn.disabled) {
                addBtn.click();
            }
        }
    });

    // Sayfa yüklendiğinde hoş geldin animasyonu
    setTimeout(() => {
        const title = document.querySelector('.main-title');
        if (title) {
            title.style.animation = 'bounce 1s ease';
        }
    }, 500);
}); 