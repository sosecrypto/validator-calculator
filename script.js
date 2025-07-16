// DeSpread 밸리데이터 수익 계산기 - 최적화된 JavaScript

// DOM 요소 캐싱
const elements = {
    // 케이스 선택
    caseBtns: document.querySelectorAll('.case-btn'),
    caseContents: document.querySelectorAll('.case-content'),
    
    // 토큰 기반 계산기
    fdvSelectToken: document.getElementById('fdv-select-token'),
    fdvCustomToken: document.getElementById('fdv-custom-token'),
    totalSupplySelect: document.getElementById('total-supply-select'),
    totalSupplyCustom: document.getElementById('total-supply-custom'),
    delegationToken: document.getElementById('delegation-token'),
    apyToken: document.getElementById('apy-token'),
    commissionToken: document.getElementById('commission-token'),
    tokenPrice: document.getElementById('token-price'),
    delegationUsdValue: document.getElementById('delegation-usd-value'),
    monthlyProfitToken: document.getElementById('monthly-profit-token'),
    yearlyProfitToken: document.getElementById('yearly-profit-token'),
    actualApyToken: document.getElementById('actual-apy-token'),
    
    // 달러 기반 계산기
    fdvSelectUsd: document.getElementById('fdv-select-usd'),
    fdvCustomUsd: document.getElementById('fdv-custom-usd'),
    delegationUsd: document.getElementById('delegation-usd'),
    apyUsd: document.getElementById('apy-usd'),
    commissionUsd: document.getElementById('commission-usd'),
    monthlyProfitUsd: document.getElementById('monthly-profit-usd'),
    yearlyProfitUsd: document.getElementById('yearly-profit-usd'),
    actualApyUsd: document.getElementById('actual-apy-usd'),
    
    // 시나리오 분석기
    targetProfitType: document.getElementById('target-profit-type'),
    targetProfitSpecific: document.getElementById('target-profit-specific'),
    targetProfitRange: document.getElementById('target-profit-range'),
    targetProfitMin: document.getElementById('target-profit-min'),
    targetProfitMax: document.getElementById('target-profit-max'),
    targetProfitCustom: document.getElementById('target-profit-custom'),
    inputFdvSelect: document.getElementById('input-fdv-select'),
    inputFdvCustom: document.getElementById('input-fdv-custom'),
    inputTotalSupplySelect: document.getElementById('input-total-supply-select'),
    inputTotalSupplyCustom: document.getElementById('input-total-supply-custom'),
    generateScenarios: document.getElementById('generate-scenarios'),
    scenariosGrid: document.getElementById('scenarios-grid'),
    filterSection: document.getElementById('filter-section'),
    applyFilter: document.getElementById('apply-filter'),
    clearFilter: document.getElementById('clear-filter'),
    
    // 필터 요소들
    filterDelegationType: document.getElementById('filter-delegation-type'),
    filterDelegationRange: document.getElementById('filter-delegation-range'),
    filterDelegationCustom: document.getElementById('filter-delegation-custom'),
    filterDelegationMin: document.getElementById('filter-delegation-min'),
    filterDelegationMax: document.getElementById('filter-delegation-max'),
    filterApyType: document.getElementById('filter-apy-type'),
    filterApySpecific: document.getElementById('filter-apy-specific'),
    filterApyRange: document.getElementById('filter-apy-range'),
    filterApyCustom: document.getElementById('filter-apy-custom'),
    filterApyMin: document.getElementById('filter-apy-min'),
    filterApyMax: document.getElementById('filter-apy-max'),
    filterCommissionType: document.getElementById('filter-commission-type'),
    filterCommissionSpecific: document.getElementById('filter-commission-specific'),
    filterCommissionRange: document.getElementById('filter-commission-range'),
    filterCommissionCustom: document.getElementById('filter-commission-custom'),
    filterCommissionMin: document.getElementById('filter-commission-min'),
    filterCommissionMax: document.getElementById('filter-commission-max')
};

// 전역 변수
let allScenarios = [];
let filteredScenarios = [];

// 유틸리티 함수들
const utils = {
    // 숫자 포맷팅
    formatNumber: (num, decimals = 2) => {
        if (num === 0) return '0';
        if (num < 0.01) return num.toExponential(2);
        return num.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // 통화 포맷팅
    formatCurrency: (amount) => {
        if (amount === 0) return '$0';
        if (amount < 0.01) return `$${amount.toExponential(2)}`;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },
    
    // 퍼센트 포맷팅
    formatPercentage: (value) => {
        return `${value.toFixed(2)}%`;
    },
    
    // 입력값 파싱
    parseInput: (value) => {
        if (!value) return 0;
        const parsed = parseFloat(value.replace(/,/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    },
    
    // 소수점 오차 허용 비교
    isApproximatelyEqual: (a, b, tolerance = 0.01) => {
        return Math.abs(a - b) <= tolerance;
    }
};

// 계산 함수들
const calculator = {
    // 토큰 가격 계산
    calculateTokenPrice: (fdv, totalSupply) => {
        return fdv / totalSupply;
    },
    
    // 위임 가치 계산 (USD)
    calculateDelegationValue: (delegation, tokenPrice) => {
        return delegation * tokenPrice;
    },
    
    // 월 수익 계산
    calculateMonthlyProfit: (delegationValue, apy, commission) => {
        const actualApy = apy * (1 - commission / 100);
        return (delegationValue * actualApy / 100) / 12;
    },
    
    // 연 수익 계산
    calculateYearlyProfit: (delegationValue, apy, commission) => {
        const actualApy = apy * (1 - commission / 100);
        return delegationValue * actualApy / 100;
    },
    
    // 실제 APY 계산
    calculateActualApy: (apy, commission) => {
        return apy * (1 - commission / 100);
    }
};

// 이벤트 리스너 설정
const eventListeners = {
    init: () => {
        // 케이스 선택 이벤트
        elements.caseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetCase = btn.dataset.case;
                eventListeners.switchCase(targetCase);
            });
        });
        
        // 토큰 기반 계산기 이벤트
        elements.fdvSelectToken.addEventListener('change', eventListeners.handleFdvChange);
        elements.totalSupplySelect.addEventListener('change', eventListeners.handleTotalSupplyChange);
        elements.delegationToken.addEventListener('input', eventListeners.handleTokenCalculation);
        elements.apyToken.addEventListener('input', eventListeners.handleTokenCalculation);
        elements.commissionToken.addEventListener('input', eventListeners.handleTokenCalculation);
        
        // 달러 기반 계산기 이벤트
        elements.fdvSelectUsd.addEventListener('change', eventListeners.handleFdvUsdChange);
        elements.delegationUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        elements.apyUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        elements.commissionUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        
        // 시나리오 분석기 이벤트
        elements.targetProfitType.addEventListener('change', eventListeners.handleTargetProfitTypeChange);
        elements.targetProfitSpecific.addEventListener('change', eventListeners.handleTargetProfitChange);
        elements.targetProfitMin.addEventListener('input', eventListeners.handleTargetProfitChange);
        elements.targetProfitMax.addEventListener('input', eventListeners.handleTargetProfitChange);
        elements.targetProfitCustom.addEventListener('input', eventListeners.handleTargetProfitChange);
        elements.inputFdvSelect.addEventListener('change', eventListeners.handleInputFdvChange);
        elements.inputTotalSupplySelect.addEventListener('change', eventListeners.handleInputTotalSupplyChange);
        elements.generateScenarios.addEventListener('click', eventListeners.generateScenarios);
        
        // 필터 이벤트
        elements.applyFilter.addEventListener('click', eventListeners.applyFilter);
        elements.clearFilter.addEventListener('click', eventListeners.clearFilter);
        
        // 필터 타입 변경 이벤트
        elements.filterDelegationType.addEventListener('change', eventListeners.handleFilterTypeChange);
        elements.filterApyType.addEventListener('change', eventListeners.handleFilterTypeChange);
        elements.filterCommissionType.addEventListener('change', eventListeners.handleFilterTypeChange);
        
        // 네비게이션 스크롤 이벤트
        window.addEventListener('scroll', eventListeners.handleScroll);
        
        // 초기 계산 실행
        eventListeners.handleTokenCalculation();
        eventListeners.handleUsdCalculation();
    },
    
    // 케이스 전환
    switchCase: (targetCase) => {
        elements.caseBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.case === targetCase);
        });
        
        elements.caseContents.forEach(content => {
            content.classList.toggle('active', content.id === `case-${targetCase}`);
        });
    },
    
    // FDV 변경 처리
    handleFdvChange: () => {
        const isCustom = elements.fdvSelectToken.value === 'custom';
        elements.fdvCustomToken.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleTokenCalculation();
    },
    
    // 총 발행량 변경 처리
    handleTotalSupplyChange: () => {
        const isCustom = elements.totalSupplySelect.value === 'custom';
        elements.totalSupplyCustom.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleTokenCalculation();
    },
    
    // 토큰 기반 계산 처리
    handleTokenCalculation: () => {
        const fdv = elements.fdvSelectToken.value === 'custom' 
            ? utils.parseInput(elements.fdvCustomToken.value) 
            : parseFloat(elements.fdvSelectToken.value);
        const totalSupply = elements.totalSupplySelect.value === 'custom'
            ? utils.parseInput(elements.totalSupplyCustom.value)
            : parseFloat(elements.totalSupplySelect.value);
        const delegation = utils.parseInput(elements.delegationToken.value);
        const apy = parseFloat(elements.apyToken.value) || 0;
        const commission = parseFloat(elements.commissionToken.value) || 0;
        
        if (fdv > 0 && totalSupply > 0) {
            const tokenPrice = calculator.calculateTokenPrice(fdv, totalSupply);
            const delegationValue = calculator.calculateDelegationValue(delegation, tokenPrice);
            const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission);
            const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission);
            const actualApy = calculator.calculateActualApy(apy, commission);
            
            elements.tokenPrice.textContent = utils.formatCurrency(tokenPrice);
            elements.delegationUsdValue.textContent = utils.formatCurrency(delegationValue);
            elements.monthlyProfitToken.textContent = utils.formatCurrency(monthlyProfit);
            elements.yearlyProfitToken.textContent = utils.formatCurrency(yearlyProfit);
            elements.actualApyToken.textContent = utils.formatPercentage(actualApy);
        }
    },
    
    // FDV USD 변경 처리
    handleFdvUsdChange: () => {
        const isCustom = elements.fdvSelectUsd.value === 'custom';
        elements.fdvCustomUsd.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleUsdCalculation();
    },
    
    // USD 기반 계산 처리
    handleUsdCalculation: () => {
        const delegationValue = parseFloat(elements.delegationUsd.value) || 0;
        const apy = parseFloat(elements.apyUsd.value) || 0;
        const commission = parseFloat(elements.commissionUsd.value) || 0;
        
        if (delegationValue > 0) {
            const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission);
            const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission);
            const actualApy = calculator.calculateActualApy(apy, commission);
            
            elements.monthlyProfitUsd.textContent = utils.formatCurrency(monthlyProfit);
            elements.yearlyProfitUsd.textContent = utils.formatCurrency(yearlyProfit);
            elements.actualApyUsd.textContent = utils.formatPercentage(actualApy);
        }
    },
    
    // 목표 수익 타입 변경 처리
    handleTargetProfitTypeChange: () => {
        const type = elements.targetProfitType.value;
        elements.targetProfitSpecific.style.display = type === 'specific' ? 'block' : 'none';
        elements.targetProfitRange.style.display = type === 'range' ? 'block' : 'none';
        elements.targetProfitCustom.style.display = type === 'custom' ? 'block' : 'none';
    },
    
    // 목표 수익 변경 처리
    handleTargetProfitChange: () => {
        // 시나리오 재생성 로직은 generateScenarios에서 처리
    },
    
    // 입력 FDV 변경 처리
    handleInputFdvChange: () => {
        const isCustom = elements.inputFdvSelect.value === 'custom';
        elements.inputFdvCustom.style.display = isCustom ? 'block' : 'none';
    },
    
    // 입력 총 발행량 변경 처리
    handleInputTotalSupplyChange: () => {
        const isCustom = elements.inputTotalSupplySelect.value === 'custom';
        elements.inputTotalSupplyCustom.style.display = isCustom ? 'block' : 'none';
    },
    
    // 시나리오 생성
    generateScenarios: () => {
        const targetProfit = eventListeners.getTargetProfit();
        const fdv = eventListeners.getInputFdv();
        const totalSupply = eventListeners.getInputTotalSupply();
        
        if (targetProfit <= 0 || fdv <= 0 || totalSupply <= 0) {
            alert('목표 수익, FDV, 총 발행량을 모두 입력해주세요.');
            return;
        }
        
        const tokenPrice = calculator.calculateTokenPrice(fdv, totalSupply);
        allScenarios = scenarioGenerator.generateScenarios(targetProfit, tokenPrice);
        filteredScenarios = [...allScenarios];
        
        elements.filterSection.style.display = 'block';
        eventListeners.displayScenarios();
    },
    
    // 목표 수익 가져오기
    getTargetProfit: () => {
        const type = elements.targetProfitType.value;
        switch (type) {
            case 'specific':
                return parseFloat(elements.targetProfitSpecific.value) || 0;
            case 'range':
                const min = parseFloat(elements.targetProfitMin.value) || 0;
                const max = parseFloat(elements.targetProfitMax.value) || 0;
                return (min + max) / 2; // 평균값 사용
            case 'custom':
                return parseFloat(elements.targetProfitCustom.value) || 0;
            default:
                return 0;
        }
    },
    
    // 입력 FDV 가져오기
    getInputFdv: () => {
        return elements.inputFdvSelect.value === 'custom'
            ? utils.parseInput(elements.inputFdvCustom.value)
            : parseFloat(elements.inputFdvSelect.value) || 0;
    },
    
    // 입력 총 발행량 가져오기
    getInputTotalSupply: () => {
        return elements.inputTotalSupplySelect.value === 'custom'
            ? utils.parseInput(elements.inputTotalSupplyCustom.value)
            : parseFloat(elements.inputTotalSupplySelect.value) || 0;
    },
    
    // 시나리오 표시
    displayScenarios: () => {
        if (filteredScenarios.length === 0) {
            elements.scenariosGrid.innerHTML = `
                <div class="placeholder-message">
                    <i class="fas fa-search"></i>
                    <p>조건에 맞는 시나리오가 없습니다. 필터 조건을 완화해보세요.</p>
                </div>
            `;
            return;
        }
        
        const tableHTML = `
            <div class="scenarios-table-header">
                <h4>목표 수익 달성 시나리오 (${filteredScenarios.length}개)</h4>
            </div>
            <table class="scenarios-table">
                <thead>
                    <tr>
                        <th>위임량 (토큰)</th>
                        <th>위임 가치 (USD)</th>
                        <th>APY</th>
                        <th>커미션</th>
                        <th>월 수익</th>
                        <th>연 수익</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredScenarios.map(scenario => `
                        <tr>
                            <td>${utils.formatNumber(scenario.delegation)}</td>
                            <td>${utils.formatCurrency(scenario.delegationValue)}</td>
                            <td>${utils.formatPercentage(scenario.apy)}</td>
                            <td>${utils.formatPercentage(scenario.commission)}</td>
                            <td>${utils.formatCurrency(scenario.monthlyProfit)}</td>
                            <td>${utils.formatCurrency(scenario.yearlyProfit)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        elements.scenariosGrid.innerHTML = tableHTML;
    },
    
    // 필터 적용
    applyFilter: () => {
        const filters = eventListeners.getFilters();
        filteredScenarios = allScenarios.filter(scenario => {
            return eventListeners.matchesFilter(scenario, filters);
        });
        eventListeners.displayScenarios();
    },
    
    // 필터 초기화
    clearFilter: () => {
        filteredScenarios = [...allScenarios];
        eventListeners.resetFilters();
        eventListeners.displayScenarios();
    },
    
    // 필터 가져오기
    getFilters: () => {
        return {
            delegation: {
                type: elements.filterDelegationType.value,
                range: elements.filterDelegationRange.value,
                min: parseFloat(elements.filterDelegationMin.value) || 0,
                max: parseFloat(elements.filterDelegationMax.value) || 0
            },
            apy: {
                type: elements.filterApyType.value,
                specific: parseFloat(elements.filterApySpecific.value) || 0,
                range: elements.filterApyRange.value,
                min: parseFloat(elements.filterApyMin.value) || 0,
                max: parseFloat(elements.filterApyMax.value) || 0
            },
            commission: {
                type: elements.filterCommissionType.value,
                specific: parseFloat(elements.filterCommissionSpecific.value) || 0,
                range: elements.filterCommissionRange.value,
                min: parseFloat(elements.filterCommissionMin.value) || 0,
                max: parseFloat(elements.filterCommissionMax.value) || 0
            }
        };
    },
    
    // 필터 매칭 확인
    matchesFilter: (scenario, filters) => {
        // 위임량 필터
        if (filters.delegation.type !== 'all') {
            if (filters.delegation.type === 'range') {
                const [min, max] = filters.delegation.range.split('-').map(Number);
                if (scenario.delegation < min || scenario.delegation > max) return false;
            } else if (filters.delegation.type === 'custom') {
                if (scenario.delegation < filters.delegation.min || scenario.delegation > filters.delegation.max) return false;
            }
        }
        
        // APY 필터
        if (filters.apy.type !== 'all') {
            if (filters.apy.type === 'specific') {
                if (!utils.isApproximatelyEqual(scenario.apy, filters.apy.specific, 0.1)) return false;
            } else if (filters.apy.type === 'range') {
                const [min, max] = filters.apy.range.split('-').map(Number);
                if (scenario.apy < min || scenario.apy > max) return false;
            } else if (filters.apy.type === 'custom') {
                if (scenario.apy < filters.apy.min || scenario.apy > filters.apy.max) return false;
            }
        }
        
        // 커미션 필터
        if (filters.commission.type !== 'all') {
            if (filters.commission.type === 'specific') {
                if (!utils.isApproximatelyEqual(scenario.commission, filters.commission.specific, 0.1)) return false;
            } else if (filters.commission.type === 'range') {
                const [min, max] = filters.commission.range.split('-').map(Number);
                if (scenario.commission < min || scenario.commission > max) return false;
            } else if (filters.commission.type === 'custom') {
                if (scenario.commission < filters.commission.min || scenario.commission > filters.commission.max) return false;
            }
        }
        
        return true;
    },
    
    // 필터 초기화
    resetFilters: () => {
        elements.filterDelegationType.value = 'all';
        elements.filterApyType.value = 'all';
        elements.filterCommissionType.value = 'all';
        eventListeners.handleFilterTypeChange();
    },
    
    // 필터 타입 변경 처리
    handleFilterTypeChange: () => {
        // 위임량 필터
        const delegationType = elements.filterDelegationType.value;
        elements.filterDelegationRange.style.display = delegationType === 'range' ? 'block' : 'none';
        elements.filterDelegationCustom.style.display = delegationType === 'custom' ? 'block' : 'none';
        
        // APY 필터
        const apyType = elements.filterApyType.value;
        elements.filterApySpecific.style.display = apyType === 'specific' ? 'block' : 'none';
        elements.filterApyRange.style.display = apyType === 'range' ? 'block' : 'none';
        elements.filterApyCustom.style.display = apyType === 'custom' ? 'block' : 'none';
        
        // 커미션 필터
        const commissionType = elements.filterCommissionType.value;
        elements.filterCommissionSpecific.style.display = commissionType === 'specific' ? 'block' : 'none';
        elements.filterCommissionRange.style.display = commissionType === 'range' ? 'block' : 'none';
        elements.filterCommissionCustom.style.display = commissionType === 'custom' ? 'block' : 'none';
    },
    
    // 스크롤 처리
    handleScroll: () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
};

// 시나리오 생성기
const scenarioGenerator = {
    generateScenarios: (targetProfit, tokenPrice) => {
        const scenarios = [];
        const delegationRanges = [
            [100000, 500000],
            [500000, 1000000],
            [1000000, 5000000],
            [5000000, 10000000],
            [10000000, 50000000],
            [50000000, 100000000]
        ];
        
        const apyValues = [2, 3, 4, 5, 8, 10, 15];
        const commissionValues = [0, 5, 10, 15, 20, 25, 30];
        
        for (const [minDelegation, maxDelegation] of delegationRanges) {
            for (const apy of apyValues) {
                for (const commission of commissionValues) {
                    const delegation = (minDelegation + maxDelegation) / 2;
                    const delegationValue = calculator.calculateDelegationValue(delegation, tokenPrice);
                    const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission);
                    
                    // 목표 수익과 비교 (소수점 오차 허용)
                    if (utils.isApproximatelyEqual(yearlyProfit, targetProfit, 100)) {
                        const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission);
                        scenarios.push({
                            delegation,
                            delegationValue,
                            apy,
                            commission,
                            monthlyProfit,
                            yearlyProfit
                        });
                    }
                }
            }
        }
        
        return scenarios.sort((a, b) => a.delegation - b.delegation);
    }
};

// 팝업 관리
const popupManager = {
    showFormulaPopup: (type) => {
        const popupHTML = `
            <div class="popup-overlay active" id="formula-popup">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>계산 공식</h3>
                        <button class="popup-close" onclick="popupManager.closePopup()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="popup-body">
                        ${type === 'calculator' ? popupManager.getCalculatorFormulas() : popupManager.getScenarioFormulas()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // 팝업 외부 클릭 시 닫기
        document.getElementById('formula-popup').addEventListener('click', (e) => {
            if (e.target.id === 'formula-popup') {
                popupManager.closePopup();
            }
        });
    },
    
    closePopup: () => {
        const popup = document.getElementById('formula-popup');
        if (popup) {
            popup.remove();
        }
    },
    
    getCalculatorFormulas: () => {
        return `
            <div class="formula-item">
                <h4>토큰 가격 계산</h4>
                <p><strong>토큰 가격 = FDV ÷ 총 발행량</strong></p>
            </div>
            <div class="formula-item">
                <h4>위임 가치 계산</h4>
                <p><strong>위임 가치 (USD) = 위임량 × 토큰 가격</strong></p>
            </div>
            <div class="formula-item">
                <h4>실제 APY 계산</h4>
                <p><strong>실제 APY = APY × (1 - 커미션 비율 ÷ 100)</strong></p>
            </div>
            <div class="formula-item">
                <h4>월 수익 계산</h4>
                <p><strong>월 수익 = 위임 가치 × 실제 APY ÷ 100 ÷ 12</strong></p>
            </div>
            <div class="formula-item">
                <h4>연 수익 계산</h4>
                <p><strong>연 수익 = 위임 가치 × 실제 APY ÷ 100</strong></p>
            </div>
        `;
    },
    
    getScenarioFormulas: () => {
        return `
            <div class="formula-item">
                <h4>시나리오 생성 로직</h4>
                <p>목표 연 수익을 달성하기 위해 다양한 위임량, APY, 커미션 조합을 계산합니다.</p>
            </div>
            <div class="formula-item">
                <h4>필터링 조건</h4>
                <p>위임량, APY, 커미션 비율을 기준으로 시나리오를 필터링할 수 있습니다.</p>
            </div>
        `;
    }
};

// 전역 함수로 노출
window.showFormulaPopup = popupManager.showFormulaPopup;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    eventListeners.init();
}); 