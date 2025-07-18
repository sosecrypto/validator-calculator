# DeSpread 밸리데이터 수익 계산기

밸리데이터의 예상 수익을 정확하게 계산할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📊 수익 계산기
- **토큰 기반 위임**: 토큰 수량으로 위임량 입력
- **달러 기반 위임**: USD 금액으로 위임량 입력
- **실시간 계산**: APY, 커미션, 운영비용 반영
- **다양한 결과**: 월 수익, 연 수익, 실제 APY 표시

### 📈 시나리오 분석기
- **목표 수익 달성**: 원하는 수익을 달성하기 위한 조건 조합 분석
- **다양한 시나리오**: 위임량, APY, 커미션 조합으로 최적 조건 찾기
- **필터링 기능**: 조건별 시나리오 필터링
- **운영비용 고려**: 현실적인 수익 계산

## 🧮 계산 방식

### 새로운 수익 계산식 (밸리데이터가 커미션 가져감)
```
기본 연 수익 = 위임 가치 × APY ÷ 100
커미션 수익 = 기본 연 수익 × 커미션 비율 ÷ 100
총 연 수익 = 기본 연 수익 + 커미션 수익
순 연 수익 = 총 연 수익 - (월간 운영 비용 × 12)
월 수익 = 순 연 수익 ÷ 12
실제 APY = (순 연 수익 ÷ 위임 가치) × 100
```

### 예시
- 위임량: $100,000
- APY: 5%
- 커미션: 10%
- 월간 운영비용: $500

**계산 과정:**
1. 기본 연 수익 = $100,000 × 5% = $5,000
2. 커미션 수익 = $5,000 × 10% = $500
3. 총 연 수익 = $5,000 + $500 = $5,500
4. 연간 운영비용 = $500 × 12 = $6,000
5. **최종 연 수익 = $5,500 - $6,000 = -$500**

## 🌐 배포 정보

### Vercel 배포
- **메인 사이트**: [https://validator-calculator.vercel.app](https://validator-calculator.vercel.app)
- **대안 버전**: [https://validator-calculator.vercel.app/validator](https://validator-calculator.vercel.app/validator)

### GitHub 저장소
- **저장소**: [https://github.com/sosecrypto/validator-calculator](https://github.com/sosecrypto/validator-calculator)

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS with modern design
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel
- **Version Control**: Git/GitHub

## 📁 프로젝트 구조

```
validator/
├── index.html              # 메인 페이지
├── script.js               # 메인 JavaScript 로직
├── styles.css              # 메인 스타일시트
├── validator.html          # 대안 페이지
├── validator/
│   ├── index.html          # 대안 메인 페이지
│   ├── script.js           # 대안 JavaScript 로직
│   └── styles.css          # 대안 스타일시트
├── vercel.json             # Vercel 배포 설정
├── README.md               # 프로젝트 문서
└── assets/                 # 이미지 및 로고 파일
    ├── white_background_blue_icon_logo.png
    ├── black_logo.png
    └── black_logo.ai
```

## 🚀 로컬 실행

1. 저장소 클론
```bash
git clone https://github.com/sosecrypto/validator-calculator.git
cd validator-calculator
```

2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# 또는 Node.js
npx serve .

# 또는 PHP
php -S localhost:8000
```

3. 브라우저에서 접속
```
http://localhost:8000
```

## 📝 업데이트 내역

### v2.0.0 (2024-12-19)
- ✅ **수익 계산 방식 변경**: 밸리데이터가 커미션을 추가 수익으로 가져가는 방식으로 변경
- ✅ **운영비용 추가**: 월간 운영비용 입력 및 계산에 반영
- ✅ **UI/UX 개선**: 커미션 라벨 변경, 수식 설명 업데이트
- ✅ **시나리오 분석 강화**: 운영비용을 고려한 현실적인 시나리오 생성

### v1.0.0 (2024-12-18)
- 🎉 **초기 릴리즈**: 기본 수익 계산기 및 시나리오 분석기 구현

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **DeSpread**: [https://despread.io](https://despread.io)
- **리서치**: [https://research.despread.io](https://research.despread.io)

---

**DeSpread** - 밸리데이터 수익 계산기 v2.0.0 