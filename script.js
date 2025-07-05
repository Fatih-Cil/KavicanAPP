// Yaz Tatili Ders Programı JavaScript - Sadece JSON Dosyası ile

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
        this.addDataButtons();
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

    saveData(dayId) {
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

        // Kullanıcıya bilgi ver
        this.showNotification('Veriler güncellendi! JSON dosyasını manuel güncelleyin.', 'info');
        
        console.log('Güncel veriler:', allData);
        console.log('JSON dosyasını manuel olarak güncelleyin veya export/import kullanın.');
    }

    addDataButtons() {
        // Header'a veri yönetimi butonları ekle
        const header = document.querySelector('header');
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'mt-3';
        buttonContainer.innerHTML = `
            <button class="btn btn-success btn-sm me-2" onclick="studyProgram.exportData()">
                <i class="fas fa-download"></i> Verileri İndir
            </button>
            <button class="btn btn-warning btn-sm me-2" onclick="studyProgram.importData()">
                <i class="fas fa-upload"></i> Verileri Yükle
            </button>
            <button class="btn btn-info btn-sm" onclick="studyProgram.showCurrentData()">
                <i class="fas fa-eye"></i> Mevcut Veriler
            </button>
        `;
        header.appendChild(buttonContainer);
    }

    exportData() {
        const allData = {};
        this.days.forEach(day => {
            allData[day.id] = {
                entries: day.entries,
                completed: day.completed
            };
        });

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'kavican_data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Veriler indirildi!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        
                        // Verileri güncelle
                        this.days.forEach(day => {
                            if (importedData[day.id]) {
                                day.entries = importedData[day.id].entries || [];
                                day.completed = importedData[day.id].completed || false;
                            }
                        });
                        
                        this.renderDays();
                        this.showNotification('Veriler başarıyla yüklendi!', 'success');
                    } catch (error) {
                        this.showNotification('Dosya okuma hatası!', 'danger');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    showCurrentData() {
        const allData = {};
        this.days.forEach(day => {
            allData[day.id] = {
                entries: day.entries,
                completed: day.completed
            };
        });

        const dataStr = JSON.stringify(allData, null, 2);
        
        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Mevcut Veriler</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">Bu verileri kopyalayıp study_data.json dosyasına yapıştırabilirsiniz:</p>
                        <textarea class="form-control" rows="20" readonly>${dataStr}</textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        <button type="button" class="btn btn-primary" onclick="navigator.clipboard.writeText('${dataStr.replace(/'/g, "\\'")}').then(() => studyProgram.showNotification('Veriler kopyalandı!', 'success'))">
                            <i class="fas fa-copy"></i> Kopyala
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
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
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : 'info'} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'danger' ? 'times-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global değişken
let studyProgram;

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    studyProgram = new StudyProgram();
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