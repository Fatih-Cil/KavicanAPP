// Yaz Tatili Ders Programı JavaScript - localStorage ile

class StudyProgram {
    constructor() {
        this.days = [
            {
                id: 'monday',
                name: 'Pazartesi',
                icon: 'fas fa-book',
                tasks: [
                    'Egzersiz / Dans yap',
                    'Türkçe (Konu tekrarı yap + En az 20 soru çöz)',
                    'Origami / El işi yap',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#FF6B6B'
            },
            {
                id: 'tuesday',
                name: 'Salı',
                icon: 'fas fa-gamepad',
                tasks: [
                    'Matematik (Konu tekrarı yap + En az 20 soru çöz)',
                    'İngilizce kiptap okuma (30 dk)',
                    'Boyama / Resim yap',
                    'Bilgmece - Bulmaca',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#4ECDC4'
            },
            {
                id: 'wednesday',
                name: 'Çarşamba',
                icon: 'fas fa-calculator',
                tasks: [
                    'Sosyal Bilgiler (Konu tekrarı yap + En az 20 soru çöz)',
                    'Belgesel izle',
                    'Satranç / Dama oyna',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#45B7D1'
            },
            {
                id: 'thursday',
                name: 'Perşembe',
                icon: 'fas fa-running',
                tasks: [
                    'Fen Bilimleri (Konu tekrarı yap + En az 20 soru çöz)',
                    'Doğa yürüyüşü yap',
                    'İnternetsiz bir gün geçir',
                    'Yeni oyun geliştir yada geliştirdiğin oyunu evdekilerle oyna',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#96CEB4'
            },
            {
                id: 'friday',
                name: 'Cuma',
                icon: 'fas fa-flask',
                tasks: [
                    'Din kültürü (Konu tekrarı yap + En az 20 soru çöz)',
                    'İngilizce kiptap okuma (30 dk)',
                    'Bilmece hafıza oyunu oyna',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#FFEAA7'
            },
            {
                id: 'saturday',
                name: 'Cumartesi',
                icon: 'fas fa-globe',
                tasks: [
                    'Sinemaya git yada evde izle',
                    'Merak ettiğin bir konuda bir belgesel izle',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#DDA0DD'
            },
            {
                id: 'sunday',
                name: 'Pazar',
                icon: 'fas fa-star',
                tasks: [
                    'Lunaparka git',
                    'Hamburger yiyebilirsin (izin almak kaydıyla)',
                    'Bilmece hafıza oyunu oyna',
                    'Türkçe hikaye kitabı oku (30 dk)',
                    'Bu gün yaptıklarını günlük olarak sisteme kaydet'
                ],
                color: '#FFB6C1'
            }
        ];
        
        this.currentDay = null;
        this.modal = null;
        this.storageKey = 'kavican_study_data';
        this.init();
    }

    init() {
        this.loadData();
        this.renderDays();
        this.setupEventListeners();
        this.modal = new bootstrap.Modal(document.getElementById('dayModal'));
        this.addDataButtons();
    }

    loadData() {
        try {
            // localStorage'dan veri yükle
            const storedData = localStorage.getItem(this.storageKey);
            
            if (storedData) {
                const serverData = JSON.parse(storedData);
                
                this.days.forEach(day => {
                    if (serverData[day.id]) {
                        day.entries = serverData[day.id].entries || [];
                        day.completed = serverData[day.id].completed || false;
                    } else {
                        day.entries = [];
                        day.completed = false;
                    }
                });
                
                console.log('Veriler localStorage\'dan yüklendi');
            } else {
                console.log('localStorage\'da veri bulunamadı, boş verilerle başlatılıyor');
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

    saveData(dayId = null) {
        try {
            // Tüm veriyi topla
            const allData = {};
            this.days.forEach(day => {
                allData[day.id] = {
                    entries: day.entries,
                    completed: day.completed
                };
            });

            // localStorage'a kaydet
            localStorage.setItem(this.storageKey, JSON.stringify(allData));
            
            // Kullanıcıya bilgi ver
            if (dayId) {
                this.showNotification(`${this.days.find(d => d.id === dayId).name} günü kaydedildi!`, 'success');
            } else {
                this.showNotification('Tüm veriler kaydedildi!', 'success');
            }
            
            console.log('Veriler localStorage\'a kaydedildi');
        } catch (error) {
            console.error('Veri kaydetme hatası:', error);
            this.showNotification('Veri kaydedilirken hata oluştu!', 'error');
        }
    }

    addDataButtons() {
        // Veri yönetimi butonları kaldırıldı - basit arayüz için
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
                        
                        // localStorage'a kaydet
                        this.saveData();
                        
                        // UI'ı güncelle
                        this.renderDays();
                        
                        this.showNotification('Veriler başarıyla yüklendi!', 'success');
                    } catch (error) {
                        console.error('Dosya okuma hatası:', error);
                        this.showNotification('Dosya okunamadı! Geçerli bir JSON dosyası seçin.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    clearData() {
        if (confirm('Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
            localStorage.removeItem(this.storageKey);
            this.initializeEmptyData();
            this.renderDays();
            this.showNotification('Tüm veriler temizlendi!', 'success');
        }
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
        
        // Modal ile göster
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
                        <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; max-height: 400px; overflow-y: auto;">${dataStr}</pre>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
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
        
        // Düzenleme modal'ı oluştur
        const editModal = document.createElement('div');
        editModal.className = 'modal fade';
        editModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Kaydı Düzenle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="editEntryContent" class="form-label">Kayıt içeriği:</label>
                            <textarea class="form-control" id="editEntryContent" rows="4">${entry.content}</textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                        <button type="button" class="btn btn-primary" id="saveEditBtn">Kaydet</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(editModal);
        const bootstrapEditModal = new bootstrap.Modal(editModal);
        bootstrapEditModal.show();
        
        // Kaydet butonuna tıklama
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            const newContent = document.getElementById('editEntryContent').value.trim();
            if (newContent !== '') {
                entry.content = newContent;
                entry.timestamp = new Date().toISOString(); // Düzenleme zamanını güncelle
                
                this.saveData(this.currentDay);
                this.renderEntries();
                this.showNotification('Kayıt güncellendi!', 'success');
                
                bootstrapEditModal.hide();
            } else {
                alert('Lütfen bir şeyler yaz!');
            }
        });
        
        // Modal kapandığında DOM'dan kaldır
        editModal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(editModal);
        });
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

    generateWeeklyReport() {
        try {
            // Haftalık verileri topla
            const weeklyData = this.getWeeklyData();
            
            if (weeklyData.totalEntries === 0) {
                this.showNotification('Bu hafta henüz kayıt bulunmuyor!', 'warning');
                return;
            }

            // PDF oluştur
            this.createWeeklyPDF(weeklyData);
            
        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            this.showNotification('Rapor oluşturulurken hata oluştu!', 'error');
        }
    }

    getWeeklyData() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Pazartesi
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Pazar
        endOfWeek.setHours(23, 59, 59, 999);

        const weeklyEntries = [];
        let totalEntries = 0;

        this.days.forEach(day => {
            if (day.entries && day.entries.length > 0) {
                day.entries.forEach(entry => {
                    const entryDate = new Date(entry.timestamp);
                    if (entryDate >= startOfWeek && entryDate <= endOfWeek) {
                        weeklyEntries.push({
                            day: day.name,
                            date: this.formatDate(entry.timestamp),
                            content: entry.content
                        });
                        totalEntries++;
                    }
                });
            }
        });

        return {
            startDate: startOfWeek,
            endDate: endOfWeek,
            entries: weeklyEntries,
            totalEntries: totalEntries,
            completedDays: this.days.filter(day => day.completed).length
        };
    }

    createWeeklyPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Başlık
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Kavican\'ın Haftalık Raporu', 105, 20, { align: 'center' });

        // Tarih aralığı
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const startDateStr = data.startDate.toLocaleDateString('tr-TR');
        const endDateStr = data.endDate.toLocaleDateString('tr-TR');
        doc.text(`${startDateStr} - ${endDateStr}`, 105, 30, { align: 'center' });

        // İstatistikler
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Haftalık İstatistikler:', 20, 45);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Toplam Kayıt: ${data.totalEntries}`, 25, 55);
        doc.text(`• Tamamlanan Gün: ${data.completedDays}/7`, 25, 65);

        // Kayıtlar tablosu
        if (data.entries.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Günlük Kayıtlar:', 20, 85);

            const tableData = data.entries.map(entry => [
                entry.day,
                entry.date,
                entry.content
            ]);

            doc.autoTable({
                startY: 95,
                head: [['Gün', 'Tarih', 'İçerik']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 107, 107],
                    textColor: 255,
                    fontSize: 10
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 40 },
                    2: { cellWidth: 120 }
                }
            });
        }

        // PDF'i indir
        const fileName = `kavican_haftalik_rapor_${data.startDate.toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        this.showNotification('Haftalık rapor başarıyla indirildi!', 'success');
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