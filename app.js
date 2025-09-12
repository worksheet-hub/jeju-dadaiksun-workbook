// 전역 변수
let currentTab = 'guide';
let dayProgress = { day1: false, day2: false, day3: false };

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기존 데이터 로드
    loadAllData();
    
    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // 모드 변경 이벤트
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('team_info_section').classList.toggle('hidden', this.value !== 'team');
        });
    });
    
    // 자동 저장
    document.querySelectorAll('.savable').forEach(element => {
        element.addEventListener('change', saveData);
        element.addEventListener('input', debounce(saveData, 1000));
    });
    
    // 사진 미리보기
    setupPhotoPreview();
    
    // 백업/복원
    setupBackupRestore();
    
    // 일차별 완료 버튼
    setupDayCompletion();
    
    // 백업 안내 닫기
    document.getElementById('hide-guide-btn')?.addEventListener('click', () => {
        document.getElementById('backup-guide').style.display = 'none';
        localStorage.setItem('hideBackupGuide', 'true');
    });
    
    // 백업 안내 표시 여부
    if (localStorage.getItem('hideBackupGuide') === 'true') {
        document.getElementById('backup-guide').style.display = 'none';
    }
    
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker 등록됨'))
            .catch(err => console.log('Service Worker 등록 실패:', err));
    }
});

// 탭 전환
function switchTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    document.getElementById(tabName).classList.remove('hidden');
    
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.remove('tab-inactive');
            button.classList.add('tab-active');
        } else {
            button.classList.remove('tab-active');
            button.classList.add('tab-inactive');
        }
    });
    
    currentTab = tabName;
    updateProgress();
}

// 진행률 업데이트
function updateProgress() {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`progress-dot-${i}`);
        const text = document.getElementById(`progress-text-${i}`);
        
        if (dayProgress[`day${i}`]) {
            dot.classList.remove('progress-inactive');
            dot.classList.add('progress-completed');
            text.classList.add('text-green-400');
        } else if (currentTab === `day${i}`) {
            dot.classList.remove('progress-inactive');
            dot.classList.add('progress-active');
            text.classList.add('text-blue-400');
        } else {
            dot.classList.add('progress-inactive');
            text.classList.remove('text-green-400', 'text-blue-400');
        }
        
        // 연결선 업데이트
        if (i < 3) {
            const line = document.getElementById(`progress-line-${i}-${i+1}`);
            if (dayProgress[`day${i}`]) {
                line.classList.remove('progress-line-inactive');
                line.classList.add('progress-line-active');
            }
        }
    }
}

// 데이터 저장
function saveData() {
    const formData = {};
    
    // 모든 저장 가능한 요소 수집
    document.querySelectorAll('.savable').forEach(element => {
        if (element.type === 'checkbox') {
            formData[element.id] = element.checked;
        } else if (element.type === 'radio') {
            if (element.checked) {
                formData[element.name] = element.value;
            }
        } else if (element.type === 'file') {
            // 파일은 별도 처리
        } else {
            formData[element.id] = element.value;
        }
    });
    
    localStorage.setItem('jejuWorkbook', JSON.stringify(formData));
    
    // 자동 저장 표시
    showAutosaveIndicator();
}

// 데이터 로드
function loadAllData() {
    const savedData = localStorage.getItem('jejuWorkbook');
    if (!savedData) return;
    
    const formData = JSON.parse(savedData);
    
    Object.keys(formData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = formData[key];
            } else if (element.type === 'radio') {
                const radio = document.querySelector(`input[name="${key}"][value="${formData[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                element.value = formData[key];
            }
        }
    });
    
    // 팀 모드 섹션 표시
    const mode = document.querySelector('input[name="mode"]:checked');
    if (mode && mode.value === 'team') {
        document.getElementById('team_info_section').classList.remove('hidden');
    }
    
    // 진행 상태 로드
    const progress = localStorage.getItem('dayProgress');
    if (progress) {
        dayProgress = JSON.parse(progress);
        updateProgress();
    }
}

// 사진 미리보기 설정
function setupPhotoPreview() {
    const photoInputs = [
        { input: 'photo_osulloc', preview: 'preview_osulloc' },
        { input: 'photo_bontae', preview: 'preview_bontae' },
        { input: 'photo_kayak', preview: 'preview_kayak' },
        { input: 'photo_seongeup', preview: 'preview_seongeup' },
        { input: 'photo_nexon', preview: 'preview_nexon' },
        { input: 'photo_arte', preview: 'preview_arte' }
    ];
    
    photoInputs.forEach(({ input, preview }) => {
        const inputEl = document.getElementById(input);
        const previewEl = document.getElementById(preview);
        
        if (inputEl && previewEl) {
            inputEl.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewEl.src = e.target.result;
                        previewEl.style.display = 'block';
                        
                        // Base64 이미지 저장
                        localStorage.setItem(input, e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // 저장된 이미지 로드
            const savedImage = localStorage.getItem(input);
            if (savedImage) {
                previewEl.src = savedImage;
                previewEl.style.display = 'block';
            }
        }
    });
}

// 일차별 완료 설정
function setupDayCompletion() {
    document.getElementById('complete-day1-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        completeDayAndGenerateImage(1);
    });
    
    document.getElementById('complete-day2-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        completeDayAndGenerateImage(2);
    });
    
    document.getElementById('complete-day3-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        completeDayAndGenerateImage(3);
    });
}

// 일차 완료 및 이미지 생성
async function completeDayAndGenerateImage(day) {
    // 진행 상태 저장
    dayProgress[`day${day}`] = true;
    localStorage.setItem('dayProgress', JSON.stringify(dayProgress));
    updateProgress();
    
    // 상태 메시지 표시
    const statusEl = document.getElementById(`day${day}-status`);
    if (statusEl) {
        statusEl.textContent = '이미지 생성 중...';
        statusEl.className = 'mt-2 text-sm text-blue-400';
    }
    
    try {
        await generateDailyImage(day);
        
        if (statusEl) {
            statusEl.textContent = `✅ ${day}일차 완료! SNS 이미지가 다운로드되었습니다.`;
            statusEl.className = 'mt-2 text-sm text-green-400';
        }
    } catch (error) {
        console.error('이미지 생성 오류:', error);
        if (statusEl) {
            statusEl.textContent = '⚠️ 이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
            statusEl.className = 'mt-2 text-sm text-red-400';
        }
    }
}

// SNS 공유용 이미지 생성 - 개선된 버전
async function generateDailyImage(day) {
    try {
        // html2canvas 라이브러리 확인
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas 라이브러리가 로드되지 않았습니다.');
        }
        
        // 학생 정보 수집 - 더 명확하게
        const anonymousMode = document.getElementById('anonymous_mode')?.checked || false;
        const studentNameValue = document.getElementById('student_name')?.value?.trim() || '';
        const studentName = anonymousMode ? '제주 탐험가' : (studentNameValue || '제주 탐험가');
        
        const studentClass = document.getElementById('student_class')?.value || '?';
        const mode = document.querySelector('input[name="mode"]:checked')?.value || 'individual';
        const teamName = document.getElementById('team_name')?.value?.trim() || '';
        const teamRole = document.getElementById('team_role')?.value || '';
        
        console.log('수집된 학생 정보:', {
            anonymousMode,
            studentNameValue,
            studentName,
            studentClass,
            mode,
            teamName,
            teamRole
        });
        
        // 날짜별 데이터 수집
        const dayData = collectDayData(day);
        
        // 템플릿 HTML 생성
        const templateHTML = createSNSTemplate(day, dayData, {
            name: studentName,
            classNum: studentClass,
            mode: mode,
            teamName: teamName,
            teamRole: teamRole
        });
        
        // 임시 컨테이너 생성
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: -10000px;
            width: 1080px;
            z-index: -1000;
            background: white;
        `;
        tempContainer.innerHTML = templateHTML;
        document.body.appendChild(tempContainer);
        
        // 이미지 로드 대기
        const images = tempContainer.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve;
                }
            });
        });
        
        await Promise.all(imagePromises);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 렌더링할 요소 확인
        const targetElement = tempContainer.querySelector('div');
        if (!targetElement) {
            throw new Error('렌더링할 요소를 찾을 수 없습니다.');
        }
        
        // 이미지 생성
        const canvas = await html2canvas(targetElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: 1080,
            height: 1920,
            windowWidth: 1080,
            windowHeight: 1920,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
                const clonedImages = clonedDoc.querySelectorAll('img');
                console.log(`클론된 이미지 수: ${clonedImages.length}`);
            }
        });
        
        // 이미지 다운로드
        canvas.toBlob(blob => {
            if (!blob) {
                throw new Error('이미지 생성에 실패했습니다.');
            }
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const safeName = studentName.replace(/[^a-zA-Z0-9가-힣]/g, '');
            const fileName = `제주학습_${day}일차_${safeName || '학생'}.png`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // 성공 알림
            showNotification(`📸 ${day}일차 SNS 이미지가 저장되었습니다!`, 'success');
        }, 'image/png', 0.95);
        
        // 임시 컨테이너 제거
        setTimeout(() => {
            document.body.removeChild(tempContainer);
        }, 100);
        
    } catch (error) {
        console.error('이미지 생성 오류 상세:', error);
        
        let errorMessage = '이미지 생성 중 오류가 발생했습니다.';
        if (error.message.includes('html2canvas')) {
            errorMessage = '이미지 생성 라이브러리를 불러올 수 없습니다. 페이지를 새로고침해주세요.';
        } else if (error.message.includes('렌더링')) {
            errorMessage = '이미지 렌더링에 실패했습니다. 다시 시도해주세요.';
        }
        
        showNotification(`⚠️ ${errorMessage}`, 'error');
        throw error;
    }
}

// 날짜별 데이터 수집
function collectDayData(day) {
    const data = {
        date: new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };
    
    if (day === 1) {
        data.title = '건축, 예술, 자연의 조화';
        data.places = [
            { name: '오설록티뮤지엄', time: '10:40~11:50', icon: '🍵' },
            { name: '본태박물관', time: '13:20~15:00', icon: '🎨' },
            { name: '곶자왈도립공원', time: '15:30~17:00', icon: '🌲' }
        ];
        data.quiz = {
            osulloc: document.querySelector('input[name="quiz_osulloc"]:checked')?.value,
            bontae: document.querySelector('input[name="quiz_bontae"]:checked')?.value,
            gotjawal: document.querySelector('input[name="quiz_gotjawal"]:checked')?.value
        };
        data.experience = document.getElementById('exp_gotjawal')?.value || '';
        data.photos = {
            osulloc: localStorage.getItem('photo_osulloc'),
            bontae: localStorage.getItem('photo_bontae')
        };
        data.highlight = '곶자왈 숲길 체험';
    } else if (day === 2) {
        data.title = '바다와 전통, 그리고 디지털 문화';
        data.places = [
            { name: '제주해녀박물관', time: '09:20~10:20', icon: '🤿' },
            { name: '하도카약', time: '10:30~11:50', icon: '🚣' },
            { name: '성읍민속마을', time: '13:40~14:40', icon: '🏘️' },
            { name: '넥슨컴퓨터박물관', time: '15:30~17:30', icon: '🎮' }
        ];
        data.quiz = {
            haenyeo: document.querySelector('input[name="quiz_haenyeo"]:checked')?.value,
            seongeup: document.querySelector('input[name="quiz_seongeup"]:checked')?.value
        };
        data.experience = {
            haenyeo: document.getElementById('exp_haenyeo')?.value || '',
            kayak: document.getElementById('exp_kayak')?.value || '',
            nexon: document.getElementById('exp_nexon')?.value || ''
        };
        data.photos = {
            kayak: localStorage.getItem('photo_kayak'),
            seongeup: localStorage.getItem('photo_seongeup'),
            nexon: localStorage.getItem('photo_nexon')
        };
        data.highlight = '카약 체험';
    } else if (day === 3) {
        data.title = '제주의 예술과 추억을 담아';
        data.places = [
            { name: '아르떼뮤지엄', time: '10:00~11:20', icon: '🎭' }
        ];
        data.quiz = {
            arte: document.querySelector('input[name="quiz_arte"]:checked')?.value
        };
        data.experience = {
            arte: document.getElementById('exp_arte')?.value || '',
            bestPlace: document.getElementById('exp_best_place')?.value || '',
            learning: document.getElementById('exp_learning')?.value || '',
            final: document.getElementById('exp_final')?.value || ''
        };
        data.photos = {
            arte: localStorage.getItem('photo_arte')
        };
        data.highlight = '미디어아트 체험';
    }
    
    return data;
}

// SNS 템플릿 생성 - 개선된 버전
function createSNSTemplate(day, data, studentInfo) {
    const dayColors = {
        1: { primary: '#3B82F6', secondary: '#60A5FA', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        2: { primary: '#10B981', secondary: '#34D399', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        3: { primary: '#8B5CF6', secondary: '#A78BFA', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
    };
    
    const color = dayColors[day];
    const photos = Object.values(data.photos || {}).filter(p => p);
    
    // 학생 정보 확인 및 기본값 설정
    const displayName = studentInfo.name || '제주 탐험가';
    const displayClass = studentInfo.classNum || '?';
    const displayTeamName = studentInfo.teamName || '';
    const displayTeamRole = studentInfo.teamRole || '';
    
    console.log('템플릿 생성 - 학생 정보:', { 
        name: displayName, 
        class: displayClass, 
        team: displayTeamName,
        role: displayTeamRole,
        mode: studentInfo.mode 
    });
    
    return `
    <div style="width: 1080px; height: 1920px; background: ${color.gradient}; position: relative; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;">
        <!-- 배경 패턴 -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);"></div>
        
        <!-- 메인 컨테이너 -->
        <div style="position: relative; padding: 60px; height: 100%; display: flex; flex-direction: column;">
            
            <!-- 헤더 -->
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
                    <div style="font-size: 24px; color: white; opacity: 0.9; margin-bottom: 10px;">대구광역시교육청 다다익선</div>
                    <div style="font-size: 48px; font-weight: bold; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                        ✈️ 제주 현장학습 Day ${day}
                    </div>
                </div>
                
                <!-- 학생 정보 배지 -->
                <div style="display: inline-block; background: white; border-radius: 30px; padding: 15px 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <div style="font-size: 28px; color: #1e293b; font-weight: 600;">
                        ${studentInfo.mode === 'team' && displayTeamName ? 
                            `🏆 ${displayTeamName}` : 
                            '👤'} 
                        글로컬 ${displayClass}반 ${displayName}
                        ${displayTeamRole ? ` | ${displayTeamRole}` : ''}
                    </div>
                </div>
            </div>
            
            <!-- 일차 테마 -->
            <div style="background: rgba(255,255,255,0.95); border-radius: 30px; padding: 30px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <h2 style="font-size: 32px; color: ${color.primary}; margin-bottom: 20px; font-weight: bold;">
                    📍 ${data.title || '오늘의 여행'}
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                    ${(data.places || []).map(place => `
                        <div style="background: ${color.primary}; color: white; padding: 12px 20px; border-radius: 20px; font-size: 22px;">
                            ${place.icon} ${place.name} <span style="opacity: 0.8; font-size: 18px;">${place.time}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 사진 갤러리 -->
            ${photos.length > 0 ? `
            <div style="background: rgba(255,255,255,0.95); border-radius: 30px; padding: 30px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <h3 style="font-size: 28px; color: ${color.primary}; margin-bottom: 20px; font-weight: bold;">
                    📸 오늘의 순간들
                </h3>
                <div style="display: grid; grid-template-columns: ${photos.length === 1 ? '1fr' : 'repeat(2, 1fr)'}; gap: 15px;">
                    ${photos.slice(0, 4).map((photo, index) => `
                        <div style="position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.2); ${photos.length === 1 ? 'grid-column: span 2;' : ''}">
                            <img src="${photo}" style="width: 100%; height: ${photos.length === 1 ? '400px' : '220px'}; object-fit: cover;" onerror="this.style.display='none'">
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- 오늘의 소감 -->
            <div style="background: rgba(255,255,255,0.95); border-radius: 30px; padding: 30px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); flex: 1;">
                <h3 style="font-size: 28px; color: ${color.primary}; margin-bottom: 20px; font-weight: bold;">
                    💭 오늘의 기록
                </h3>
                <div style="font-size: 22px; line-height: 1.8; color: #475569;">
                    ${getFormattedExperience(day, data) || '즐거운 제주 여행!'}
                </div>
                
                ${day === 3 && data.experience && data.experience.final ? `
                <div style="margin-top: 30px; padding: 20px; background: ${color.primary}; border-radius: 20px;">
                    <div style="font-size: 26px; color: white; text-align: center; font-weight: bold;">
                        🏆 "${data.experience.final}"
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- 푸터 -->
            <div style="background: rgba(255,255,255,0.9); border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 20px; color: #64748b;">
                    ${data.date || new Date().toLocaleDateString('ko-KR')}
                </div>
                <div style="font-size: 18px; color: ${color.primary}; font-weight: 600;">
                    #제주현장학습 #다다익선 #글로컬${displayClass}반 #Day${day}
                </div>
            </div>
        </div>
    </div>
    `;
}

// 소감 포맷팅
function getFormattedExperience(day, data) {
    let experience = '';
    
    if (day === 1) {
        if (data.experience) {
            experience = `<strong>🌲 곶자왈에서:</strong> ${data.experience}`;
        }
    } else if (day === 2) {
        const parts = [];
        if (data.experience.haenyeo) {
            parts.push(`<strong>🤿 해녀문화:</strong> ${data.experience.haenyeo}`);
        }
        if (data.experience.kayak) {
            parts.push(`<strong>🚣 카약체험:</strong> ${data.experience.kayak}`);
        }
        if (data.experience.nexon) {
            parts.push(`<strong>🎮 넥슨박물관:</strong> ${data.experience.nexon}`);
        }
        experience = parts.join('<br><br>');
    } else if (day === 3) {
        const parts = [];
        if (data.experience.arte) {
            parts.push(`<strong>🎭 아르떼뮤지엄:</strong> ${data.experience.arte}`);
        }
        if (data.experience.bestPlace) {
            parts.push(`<strong>⭐ 최고의 장소:</strong> ${data.experience.bestPlace}`);
        }
        if (data.experience.learning) {
            parts.push(`<strong>📚 배움과 성장:</strong> ${data.experience.learning}`);
        }
        experience = parts.join('<br><br>');
    }
    
    return experience || '오늘도 제주에서 특별한 추억을 만들었습니다.';
}

// 알림 표시
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 자동 저장 표시
function showAutosaveIndicator() {
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }
}

// 백업/복원 설정
function setupBackupRestore() {
    // 백업 내보내기
    document.getElementById('export-btn')?.addEventListener('click', () => {
        const data = {
            version: '1.0',
            date: new Date().toISOString(),
            formData: localStorage.getItem('jejuWorkbook'),
            photos: {},
            progress: localStorage.getItem('dayProgress')
        };
        
        // 사진 데이터 수집
        ['photo_osulloc', 'photo_bontae', 'photo_kayak', 'photo_seongeup', 'photo_nexon', 'photo_arte'].forEach(key => {
            const photoData = localStorage.getItem(key);
            if (photoData) {
                data.photos[key] = photoData;
            }
        });
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `제주학습백업_${new Date().toLocaleDateString('ko-KR').replace(/\. /g, '')}.jeju`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('💾 백업 파일이 저장되었습니다!', 'success');
    });
    
    // 백업 불러오기
    document.getElementById('import-file')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // 데이터 복원
                if (data.formData) {
                    localStorage.setItem('jejuWorkbook', data.formData);
                }
                if (data.progress) {
                    localStorage.setItem('dayProgress', data.progress);
                }
                
                // 사진 복원
                Object.keys(data.photos || {}).forEach(key => {
                    localStorage.setItem(key, data.photos[key]);
                });
                
                // 페이지 새로고침
                location.reload();
                
            } catch (error) {
                console.error('백업 파일 읽기 오류:', error);
                showNotification('⚠️ 백업 파일을 읽을 수 없습니다.', 'error');
            }
        };
        reader.readAsText(file);
    });
    
    // 초기화
    document.getElementById('reset-btn')?.addEventListener('click', () => {
        if (confirm('정말로 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            localStorage.clear();
            location.reload();
        }
    });
}

// 홈으로 이동
function goToHome() {
    switchTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);