// DeSpread 밸리데이터 수익 계산기 - 최적화된 JavaScript

// DOM 로딩 확인 함수
const isDOMReady = () => {
    return document.readyState === 'loading' ? false : true;
};

// DOM 요소 캐싱
let elements = {};

// DOM 요소 초기화
const initializeElements = () => {
    console.log('DOM 요소 초기화 중...');
    
    elements = {
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
        commissionTokenCustom: document.getElementById('commission-token-custom'),
        operatingCostToken: document.getElementById('operating-cost-token'),
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
        commissionUsdCustom: document.getElementById('commission-usd-custom'),
        operatingCostUsd: document.getElementById('operating-cost-usd'),
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
        inputOperatingCost: document.getElementById('input-operating-cost'),
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
    
    console.log('DOM 요소 초기화 완료:', elements);
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
    
    // 월 수익 계산 (운영 비용 포함, 밸리데이터가 커미션 가져감)
    calculateMonthlyProfit: (delegationValue, apy, commission, monthlyOperatingCost = 0) => {
        const grossYearlyProfit = delegationValue * apy / 100;
        const commissionEarnings = grossYearlyProfit * (commission / 100);
        const totalYearlyProfit = grossYearlyProfit + commissionEarnings;
        const yearlyOperatingCost = monthlyOperatingCost * 12;
        const netYearlyProfit = totalYearlyProfit - yearlyOperatingCost;
        return netYearlyProfit / 12;
    },
    
    // 연 수익 계산 (운영 비용 포함, 밸리데이터가 커미션 가져감)
    calculateYearlyProfit: (delegationValue, apy, commission, monthlyOperatingCost = 0) => {
        const grossYearlyProfit = delegationValue * apy / 100;
        const commissionEarnings = grossYearlyProfit * (commission / 100);
        const totalYearlyProfit = grossYearlyProfit + commissionEarnings;
        const yearlyOperatingCost = monthlyOperatingCost * 12;
        return totalYearlyProfit - yearlyOperatingCost;
    },
    
    // 실제 APY 계산 (운영 비용 포함, 밸리데이터가 커미션 가져감)
    calculateActualApy: (apy, commission, delegationValue, monthlyOperatingCost = 0) => {
        const grossYearlyProfit = delegationValue * apy / 100;
        const commissionEarnings = grossYearlyProfit * (commission / 100);
        const totalYearlyProfit = grossYearlyProfit + commissionEarnings;
        const yearlyOperatingCost = monthlyOperatingCost * 12;
        const netYearlyProfit = totalYearlyProfit - yearlyOperatingCost;
        return (netYearlyProfit / delegationValue) * 100;
    }
};

// 이벤트 리스너 설정
const eventListeners = {
    init: () => {
        console.log('이벤트 리스너 초기화 시작...');
        
        // DOM 요소가 모두 로드되었는지 확인
        if (!elements.caseBtns || elements.caseBtns.length === 0) {
            console.error('DOM 요소를 찾을 수 없습니다. DOM이 완전히 로드되지 않았을 수 있습니다.');
            return;
        }
        
        // 케이스 선택 이벤트
        elements.caseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('케이스 버튼 클릭:', btn.dataset.case);
                const targetCase = btn.dataset.case;
                eventListeners.switchCase(targetCase);
            });
        });
        
        // 토큰 기반 계산기 이벤트
        if (elements.fdvSelectToken) {
            elements.fdvSelectToken.addEventListener('change', eventListeners.handleFdvChange);
        }
        if (elements.totalSupplySelect) {
            elements.totalSupplySelect.addEventListener('change', eventListeners.handleTotalSupplyChange);
        }
        if (elements.delegationToken) {
            elements.delegationToken.addEventListener('input', eventListeners.handleTokenCalculation);
        }
        if (elements.apyToken) {
            elements.apyToken.addEventListener('input', eventListeners.handleTokenCalculation);
        }
        if (elements.commissionToken) {
            elements.commissionToken.addEventListener('change', eventListeners.handleCommissionTokenChange);
        }
        if (elements.commissionTokenCustom) {
            elements.commissionTokenCustom.addEventListener('input', eventListeners.handleTokenCalculation);
        }
        if (elements.operatingCostToken) {
            elements.operatingCostToken.addEventListener('input', eventListeners.handleTokenCalculation);
        }
        
        // 달러 기반 계산기 이벤트
        if (elements.fdvSelectUsd) {
            elements.fdvSelectUsd.addEventListener('change', eventListeners.handleFdvUsdChange);
        }
        if (elements.delegationUsd) {
            elements.delegationUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        }
        if (elements.apyUsd) {
            elements.apyUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        }
        if (elements.commissionUsd) {
            elements.commissionUsd.addEventListener('change', eventListeners.handleCommissionUsdChange);
        }
        if (elements.commissionUsdCustom) {
            elements.commissionUsdCustom.addEventListener('input', eventListeners.handleUsdCalculation);
        }
        if (elements.operatingCostUsd) {
            elements.operatingCostUsd.addEventListener('input', eventListeners.handleUsdCalculation);
        }
        
        // 시나리오 분석기 이벤트
        if (elements.targetProfitType) {
            elements.targetProfitType.addEventListener('change', eventListeners.handleTargetProfitTypeChange);
        }
        if (elements.targetProfitSpecific) {
            elements.targetProfitSpecific.addEventListener('change', eventListeners.handleTargetProfitChange);
        }
        if (elements.targetProfitMin) {
            elements.targetProfitMin.addEventListener('input', eventListeners.handleTargetProfitChange);
        }
        if (elements.targetProfitMax) {
            elements.targetProfitMax.addEventListener('input', eventListeners.handleTargetProfitChange);
        }
        if (elements.targetProfitCustom) {
            elements.targetProfitCustom.addEventListener('input', eventListeners.handleTargetProfitChange);
        }
        if (elements.inputFdvSelect) {
            elements.inputFdvSelect.addEventListener('change', eventListeners.handleInputFdvChange);
        }
        if (elements.inputTotalSupplySelect) {
            elements.inputTotalSupplySelect.addEventListener('change', eventListeners.handleInputTotalSupplyChange);
        }
        if (elements.generateScenarios) {
            elements.generateScenarios.addEventListener('click', eventListeners.generateScenarios);
        }
        
        // 필터 이벤트
        if (elements.applyFilter) {
            elements.applyFilter.addEventListener('click', eventListeners.applyFilter);
            console.log('필터 적용 버튼 이벤트 등록 완료');
        } else {
            console.error('필터 적용 버튼을 찾을 수 없습니다.');
        }
        
        if (elements.clearFilter) {
            elements.clearFilter.addEventListener('click', eventListeners.clearFilter);
            console.log('필터 초기화 버튼 이벤트 등록 완료');
        } else {
            console.error('필터 초기화 버튼을 찾을 수 없습니다.');
        }
        
        // 필터 타입 변경 이벤트
        if (elements.filterDelegationType) {
            elements.filterDelegationType.addEventListener('change', eventListeners.handleFilterTypeChange);
            console.log('위임량 필터 타입 이벤트 등록 완료');
        } else {
            console.error('위임량 필터 타입을 찾을 수 없습니다.');
        }
        
        if (elements.filterApyType) {
            elements.filterApyType.addEventListener('change', eventListeners.handleFilterTypeChange);
            console.log('APY 필터 타입 이벤트 등록 완료');
        } else {
            console.error('APY 필터 타입을 찾을 수 없습니다.');
        }
        
        if (elements.filterCommissionType) {
            elements.filterCommissionType.addEventListener('change', eventListeners.handleFilterTypeChange);
            console.log('커미션 필터 타입 이벤트 등록 완료');
        } else {
            console.error('커미션 필터 타입을 찾을 수 없습니다.');
        }
        
        // 네비게이션 스크롤 이벤트
        window.addEventListener('scroll', eventListeners.handleScroll);
        
        // 초기 계산 실행
        eventListeners.handleTokenCalculation();
        eventListeners.handleUsdCalculation();
        
        console.log('이벤트 리스너 초기화 완료');
    },
    
    // 케이스 전환
    switchCase: (targetCase) => {
        console.log('케이스 전환:', targetCase);
        elements.caseBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.case === targetCase);
        });
        
        elements.caseContents.forEach(content => {
            content.classList.toggle('active', content.id === `case-${targetCase}`);
        });
    },
    
    // FDV 변경 처리
    handleFdvChange: () => {
        console.log('FDV 변경');
        const isCustom = elements.fdvSelectToken.value === 'custom';
        elements.fdvCustomToken.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleTokenCalculation();
    },
    
    // 총 발행량 변경 처리
    handleTotalSupplyChange: () => {
        console.log('총 발행량 변경');
        const isCustom = elements.totalSupplySelect.value === 'custom';
        elements.totalSupplyCustom.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleTokenCalculation();
    },
    
    // 토큰 커미션 변경 처리
    handleCommissionTokenChange: () => {
        console.log('토큰 커미션 변경');
        const isCustom = elements.commissionToken.value === 'custom';
        elements.commissionTokenCustom.style.display = isCustom ? 'block' : 'none';
        if (isCustom) {
            elements.commissionTokenCustom.focus();
        }
        eventListeners.handleTokenCalculation();
    },
    
    // USD 커미션 변경 처리
    handleCommissionUsdChange: () => {
        console.log('USD 커미션 변경');
        const isCustom = elements.commissionUsd.value === 'custom';
        elements.commissionUsdCustom.style.display = isCustom ? 'block' : 'none';
        if (isCustom) {
            elements.commissionUsdCustom.focus();
        }
        eventListeners.handleUsdCalculation();
    },
    
    // 토큰 기반 계산 처리
    handleTokenCalculation: () => {
        console.log('토큰 기반 계산 실행');
        const fdv = elements.fdvSelectToken.value === 'custom' 
            ? utils.parseInput(elements.fdvCustomToken.value) 
            : parseFloat(elements.fdvSelectToken.value);
        const totalSupply = elements.totalSupplySelect.value === 'custom'
            ? utils.parseInput(elements.totalSupplyCustom.value)
            : parseFloat(elements.totalSupplySelect.value);
        const delegation = utils.parseInput(elements.delegationToken.value);
        const apy = parseFloat(elements.apyToken.value) || 0;
        const commission = elements.commissionToken.value === 'custom' 
            ? parseFloat(elements.commissionTokenCustom.value) || 0
            : parseFloat(elements.commissionToken.value) || 0;
        const monthlyOperatingCost = parseFloat(elements.operatingCostToken.value) || 0;
        
        console.log('계산 값:', { fdv, totalSupply, delegation, apy, commission, monthlyOperatingCost });
        
        if (fdv > 0 && totalSupply > 0) {
            const tokenPrice = calculator.calculateTokenPrice(fdv, totalSupply);
            const delegationValue = calculator.calculateDelegationValue(delegation, tokenPrice);
            const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
            const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
            const actualApy = calculator.calculateActualApy(apy, commission, delegationValue, monthlyOperatingCost);
            
            elements.tokenPrice.textContent = utils.formatCurrency(tokenPrice);
            elements.delegationUsdValue.textContent = utils.formatCurrency(delegationValue);
            elements.monthlyProfitToken.textContent = utils.formatCurrency(monthlyProfit);
            elements.yearlyProfitToken.textContent = utils.formatCurrency(yearlyProfit);
            elements.actualApyToken.textContent = utils.formatPercentage(actualApy);
            
            console.log('계산 결과:', { tokenPrice, delegationValue, monthlyProfit, yearlyProfit, actualApy, monthlyOperatingCost });
        }
    },
    
    // FDV USD 변경 처리
    handleFdvUsdChange: () => {
        console.log('FDV USD 변경');
        const isCustom = elements.fdvSelectUsd.value === 'custom';
        elements.fdvCustomUsd.style.display = isCustom ? 'block' : 'none';
        eventListeners.handleUsdCalculation();
    },
    
    // USD 기반 계산 처리
    handleUsdCalculation: () => {
        console.log('USD 기반 계산 실행');
        const delegationValue = parseFloat(elements.delegationUsd.value) || 0;
        const apy = parseFloat(elements.apyUsd.value) || 0;
        const commission = elements.commissionUsd.value === 'custom' 
            ? parseFloat(elements.commissionUsdCustom.value) || 0
            : parseFloat(elements.commissionUsd.value) || 0;
        const monthlyOperatingCost = parseFloat(elements.operatingCostUsd.value) || 0;
        
        if (delegationValue > 0) {
            const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
            const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
            const actualApy = calculator.calculateActualApy(apy, commission, delegationValue, monthlyOperatingCost);
            
            elements.monthlyProfitUsd.textContent = utils.formatCurrency(monthlyProfit);
            elements.yearlyProfitUsd.textContent = utils.formatCurrency(yearlyProfit);
            elements.actualApyUsd.textContent = utils.formatPercentage(actualApy);
        }
    },
    
    // 목표 수익 타입 변경 처리
    handleTargetProfitTypeChange: () => {
        console.log('목표 수익 타입 변경');
        const type = elements.targetProfitType.value;
        elements.targetProfitSpecific.style.display = type === 'specific' ? 'block' : 'none';
        elements.targetProfitRange.style.display = type === 'range' ? 'block' : 'none';
        elements.targetProfitCustom.style.display = type === 'custom' ? 'block' : 'none';
    },
    
    // 목표 수익 변경 처리
    handleTargetProfitChange: () => {
        console.log('목표 수익 변경');
        // 시나리오 재생성 로직은 generateScenarios에서 처리
    },
    
    // 입력 FDV 변경 처리
    handleInputFdvChange: () => {
        console.log('입력 FDV 변경');
        const isCustom = elements.inputFdvSelect.value === 'custom';
        elements.inputFdvCustom.style.display = isCustom ? 'block' : 'none';
    },
    
    // 입력 총 발행량 변경 처리
    handleInputTotalSupplyChange: () => {
        console.log('입력 총 발행량 변경');
        const isCustom = elements.inputTotalSupplySelect.value === 'custom';
        elements.inputTotalSupplyCustom.style.display = isCustom ? 'block' : 'none';
    },
    
    // 시나리오 생성
    generateScenarios: () => {
        console.log('시나리오 생성 시작');
        const targetProfit = eventListeners.getTargetProfit();
        const fdv = eventListeners.getInputFdv();
        const totalSupply = eventListeners.getInputTotalSupply();
        const monthlyOperatingCost = eventListeners.getInputOperatingCost();
        
        console.log('시나리오 생성 값:', { targetProfit, fdv, totalSupply, monthlyOperatingCost });
        
        if (targetProfit <= 0 || fdv <= 0 || totalSupply <= 0) {
            alert('목표 수익, FDV, 총 발행량을 모두 입력해주세요.');
            return;
        }
        
        // 토큰 가격 계산
        const tokenPrice = calculator.calculateTokenPrice(fdv, totalSupply);
        console.log('계산된 토큰 가격:', tokenPrice);
        
        if (tokenPrice <= 0) {
            alert('토큰 가격이 0 이하입니다. FDV와 총 발행량을 확인해주세요.');
            return;
        }
        
        // 시나리오 생성 (월간 운영 비용 포함)
        allScenarios = scenarioGenerator.generateScenarios(targetProfit, tokenPrice, monthlyOperatingCost);
        filteredScenarios = [...allScenarios];
        
        console.log('생성된 시나리오:', allScenarios);
        
        if (allScenarios.length === 0) {
            alert('목표 수익을 달성할 수 있는 시나리오를 찾을 수 없습니다. 목표 수익을 낮추거나 FDV/총 발행량을 조정해보세요.');
            return;
        }
        
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
    
    // 입력 월간 운영 비용 가져오기
    getInputOperatingCost: () => {
        return parseFloat(elements.inputOperatingCost.value) || 0;
    },
    
    // 시나리오 표시
    displayScenarios: () => {
        console.log('시나리오 표시 시작:', filteredScenarios.length);
        
        if (!elements.scenariosGrid) {
            console.error('시나리오 그리드 요소를 찾을 수 없습니다.');
            return;
        }
        
        if (filteredScenarios.length === 0) {
            // 현재 필터 상태 가져오기
            const currentFilters = eventListeners.getFilters();
            const activeFilters = [];
            if (currentFilters.delegation.type !== 'all') activeFilters.push('위임량');
            if (currentFilters.apy.type !== 'all') activeFilters.push('APY');
            if (currentFilters.commission.type !== 'all') activeFilters.push('커미션');
            
            let message = '조건에 맞는 시나리오가 없습니다.';
            if (activeFilters.length > 0) {
                message += `<br><strong>활성 필터:</strong> ${activeFilters.join(', ')}`;
                message += '<br>필터 조건을 완화하거나 "모든 수량/APY/비율"로 변경해보세요.';
            } else {
                message += '<br>시나리오를 다시 생성해보세요.';
            }
            
            elements.scenariosGrid.innerHTML = `
                <div class="placeholder-message">
                    <i class="fas fa-search"></i>
                    <p>${message}</p>
                </div>
            `;
            console.log('시나리오 없음 - 플레이스홀더 표시:', { activeFilters });
            return;
        }
        
        console.log('시나리오 테이블 생성 중...');
        
        // 테이블 헤더 생성
        const tableHeader = `
            <div class="scenarios-table-header">
                <h4>목표 수익 달성 시나리오 (${filteredScenarios.length}개)</h4>
            </div>
        `;
        
        // 테이블 바디 생성
        const tableRows = filteredScenarios.map(scenario => `
            <tr>
                <td>${utils.formatNumber(scenario.delegation)}</td>
                <td>${utils.formatCurrency(scenario.delegationValue)}</td>
                <td>${utils.formatPercentage(scenario.apy)}</td>
                <td>${utils.formatPercentage(scenario.commission)}</td>
                <td>${utils.formatCurrency(scenario.monthlyOperatingCost)}</td>
                <td>${utils.formatCurrency(scenario.monthlyProfit)}</td>
                <td>${utils.formatCurrency(scenario.yearlyProfit)}</td>
            </tr>
        `).join('');
        
        const tableHTML = `
            ${tableHeader}
            <div class="table-container">
                <table class="scenarios-table">
                    <thead>
                        <tr>
                            <th>위임량 (토큰)</th>
                            <th>위임 가치 (USD)</th>
                            <th>APY</th>
                            <th>밸리데이터 커미션</th>
                            <th>월간 운영비용</th>
                            <th>월 수익</th>
                            <th>연 수익</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
        
        elements.scenariosGrid.innerHTML = tableHTML;
        console.log('시나리오 테이블 생성 완료');
    },
    
    // 필터 적용
    applyFilter: () => {
        console.log('필터 적용 시작');
        
        // DOM 요소 확인
        if (!elements.filterDelegationType || !elements.filterApyType || !elements.filterCommissionType) {
            console.error('필터 DOM 요소를 찾을 수 없습니다:', {
                filterDelegationType: !!elements.filterDelegationType,
                filterApyType: !!elements.filterApyType,
                filterCommissionType: !!elements.filterCommissionType
            });
            alert('필터 요소를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        const filters = eventListeners.getFilters();
        console.log('적용할 필터:', filters);
        
        if (allScenarios.length === 0) {
            console.log('필터링할 시나리오가 없습니다.');
            alert('먼저 시나리오를 생성해주세요.');
            return;
        }
        
        // 필터 적용 전 시나리오 수 로그
        console.log('필터 적용 전 시나리오 수:', allScenarios.length);
        
        filteredScenarios = allScenarios.filter(scenario => {
            const matches = eventListeners.matchesFilter(scenario, filters);
            if (matches) {
                console.log('시나리오 매칭:', {
                    delegation: scenario.delegation,
                    apy: scenario.apy,
                    commission: scenario.commission
                });
            }
            return matches;
        });
        
        console.log('필터 적용 결과:', {
            totalScenarios: allScenarios.length,
            filteredScenarios: filteredScenarios.length,
            filters: filters
        });
        
        eventListeners.displayScenarios();
    },
    
    // 필터 초기화
    clearFilter: () => {
        console.log('필터 초기화 시작');
        
        if (allScenarios.length === 0) {
            console.log('초기화할 시나리오가 없습니다.');
            alert('먼저 시나리오를 생성해주세요.');
            return;
        }
        
        filteredScenarios = [...allScenarios];
        eventListeners.resetFilters();
        eventListeners.displayScenarios();
        console.log('필터 초기화 완료 - 시나리오 수:', filteredScenarios.length);
    },
    
    // 필터 가져오기
    getFilters: () => {
        const filters = {
            delegation: {
                type: elements.filterDelegationType ? elements.filterDelegationType.value : 'all',
                range: elements.filterDelegationRange ? elements.filterDelegationRange.value : '',
                min: parseFloat(elements.filterDelegationMin ? elements.filterDelegationMin.value : 0) || 0,
                max: parseFloat(elements.filterDelegationMax ? elements.filterDelegationMax.value : 0) || 0
            },
            apy: {
                type: elements.filterApyType ? elements.filterApyType.value : 'all',
                specific: parseFloat(elements.filterApySpecific ? elements.filterApySpecific.value : 0) || 0,
                range: elements.filterApyRange ? elements.filterApyRange.value : '',
                min: parseFloat(elements.filterApyMin ? elements.filterApyMin.value : 0) || 0,
                max: parseFloat(elements.filterApyMax ? elements.filterApyMax.value : 0) || 0
            },
            commission: {
                type: elements.filterCommissionType ? elements.filterCommissionType.value : 'all',
                specific: parseFloat(elements.filterCommissionSpecific ? elements.filterCommissionSpecific.value : 0) || 0,
                range: elements.filterCommissionRange ? elements.filterCommissionRange.value : '',
                min: parseFloat(elements.filterCommissionMin ? elements.filterCommissionMin.value : 0) || 0,
                max: parseFloat(elements.filterCommissionMax ? elements.filterCommissionMax.value : 0) || 0
            }
        };
        
        console.log('필터 설정:', filters);
        return filters;
    },
    
    // 필터 매칭 확인
    matchesFilter: (scenario, filters) => {
        console.log('필터 매칭 확인:', { scenario, filters });
        
        // 위임량 필터
        if (filters.delegation.type !== 'all') {
            if (filters.delegation.type === 'range') {
                const [min, max] = filters.delegation.range.split('-').map(Number);
                if (scenario.delegation < min || scenario.delegation > max) {
                    console.log('위임량 범위 필터 불일치:', { scenario: scenario.delegation, min, max });
                    return false;
                }
            } else if (filters.delegation.type === 'custom') {
                if (scenario.delegation < filters.delegation.min || scenario.delegation > filters.delegation.max) {
                    console.log('위임량 커스텀 필터 불일치:', { scenario: scenario.delegation, min: filters.delegation.min, max: filters.delegation.max });
                    return false;
                }
            }
        }
        
        // APY 필터 - 더 유연한 매칭
        if (filters.apy.type !== 'all') {
            if (filters.apy.type === 'specific') {
                // 특정 APY의 경우 ±0.5% 허용 오차 적용
                const tolerance = Math.max(filters.apy.specific * 0.005, 0.1);
                if (Math.abs(scenario.apy - filters.apy.specific) > tolerance) {
                    console.log('APY 특정값 필터 불일치:', { 
                        scenario: scenario.apy, 
                        filter: filters.apy.specific, 
                        tolerance: tolerance,
                        difference: Math.abs(scenario.apy - filters.apy.specific)
                    });
                    return false;
                }
            } else if (filters.apy.type === 'range') {
                const [min, max] = filters.apy.range.split('-').map(Number);
                if (scenario.apy < min || scenario.apy > max) {
                    console.log('APY 범위 필터 불일치:', { scenario: scenario.apy, min, max });
                    return false;
                }
            } else if (filters.apy.type === 'custom') {
                if (scenario.apy < filters.apy.min || scenario.apy > filters.apy.max) {
                    console.log('APY 커스텀 필터 불일치:', { scenario: scenario.apy, min: filters.apy.min, max: filters.apy.max });
                    return false;
                }
            }
        }
        
        // 커미션 필터 - 더 유연한 매칭
        if (filters.commission.type !== 'all') {
            if (filters.commission.type === 'specific') {
                // 특정 커미션의 경우 ±0.5% 허용 오차 적용
                const tolerance = Math.max(filters.commission.specific * 0.005, 0.1);
                if (Math.abs(scenario.commission - filters.commission.specific) > tolerance) {
                    console.log('커미션 특정값 필터 불일치:', { 
                        scenario: scenario.commission, 
                        filter: filters.commission.specific, 
                        tolerance: tolerance,
                        difference: Math.abs(scenario.commission - filters.commission.specific)
                    });
                    return false;
                }
            } else if (filters.commission.type === 'range') {
                const [min, max] = filters.commission.range.split('-').map(Number);
                if (scenario.commission < min || scenario.commission > max) {
                    console.log('커미션 범위 필터 불일치:', { scenario: scenario.commission, min, max });
                    return false;
                }
            } else if (filters.commission.type === 'custom') {
                if (scenario.commission < filters.commission.min || scenario.commission > filters.commission.max) {
                    console.log('커미션 커스텀 필터 불일치:', { scenario: scenario.commission, min: filters.commission.min, max: filters.commission.max });
                    return false;
                }
            }
        }
        
        console.log('필터 매칭 성공');
        return true;
    },
    
    // 필터 초기화
    resetFilters: () => {
        console.log('필터 초기화 실행');
        
        if (elements.filterDelegationType) {
            elements.filterDelegationType.value = 'all';
        }
        if (elements.filterApyType) {
            elements.filterApyType.value = 'all';
        }
        if (elements.filterCommissionType) {
            elements.filterCommissionType.value = 'all';
        }
        
        // 모든 필터 입력 필드 숨기기
        const filterElements = [
            'filterDelegationRange', 'filterDelegationCustom',
            'filterApySpecific', 'filterApyRange', 'filterApyCustom',
            'filterCommissionSpecific', 'filterCommissionRange', 'filterCommissionCustom'
        ];
        
        filterElements.forEach(elementId => {
            if (elements[elementId]) {
                elements[elementId].style.display = 'none';
            }
        });
        
        console.log('필터 초기화 완료');
    },
    
    // 필터 타입 변경 처리
    handleFilterTypeChange: () => {
        console.log('필터 타입 변경 처리');
        
        // 위임량 필터
        if (elements.filterDelegationType) {
            const delegationType = elements.filterDelegationType.value;
            console.log('위임량 필터 타입:', delegationType);
            
            if (elements.filterDelegationRange) {
                elements.filterDelegationRange.style.display = delegationType === 'range' ? 'block' : 'none';
            }
            if (elements.filterDelegationCustom) {
                elements.filterDelegationCustom.style.display = delegationType === 'custom' ? 'block' : 'none';
            }
        }
        
        // APY 필터
        if (elements.filterApyType) {
            const apyType = elements.filterApyType.value;
            console.log('APY 필터 타입:', apyType);
            
            if (elements.filterApySpecific) {
                elements.filterApySpecific.style.display = apyType === 'specific' ? 'block' : 'none';
            }
            if (elements.filterApyRange) {
                elements.filterApyRange.style.display = apyType === 'range' ? 'block' : 'none';
            }
            if (elements.filterApyCustom) {
                elements.filterApyCustom.style.display = apyType === 'custom' ? 'block' : 'none';
            }
        }
        
        // 커미션 필터
        if (elements.filterCommissionType) {
            const commissionType = elements.filterCommissionType.value;
            console.log('커미션 필터 타입:', commissionType);
            
            if (elements.filterCommissionSpecific) {
                elements.filterCommissionSpecific.style.display = commissionType === 'specific' ? 'block' : 'none';
            }
            if (elements.filterCommissionRange) {
                elements.filterCommissionRange.style.display = commissionType === 'range' ? 'block' : 'none';
            }
            if (elements.filterCommissionCustom) {
                elements.filterCommissionCustom.style.display = commissionType === 'custom' ? 'block' : 'none';
            }
        }
        
        console.log('필터 타입 변경 처리 완료');
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
    generateScenarios: (targetProfit, tokenPrice, monthlyOperatingCost = 0) => {
        console.log('시나리오 생성:', { targetProfit, tokenPrice, monthlyOperatingCost });
        const scenarios = [];
        
        // 더 세밀하고 다양한 위임량 범위 설정
        const delegationValues = [
            // 소액 위임 (10K ~ 100K)
            10000, 25000, 50000, 75000, 100000,
            // 중간 위임 (100K ~ 1M)
            150000, 200000, 300000, 400000, 500000, 600000, 750000, 900000, 1000000,
            // 대액 위임 (1M ~ 10M)
            1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 6000000, 7500000, 8000000, 9000000, 10000000,
            // 대형 위임 (10M ~ 100M)
            15000000, 20000000, 25000000, 30000000, 40000000, 50000000, 60000000, 75000000, 80000000, 90000000, 100000000,
            // 초대형 위임 (100M+)
            150000000, 200000000, 250000000, 300000000, 400000000, 500000000
        ];
        
        // 더 세밀한 APY 범위 (필터에서 자주 사용되는 값들을 우선 포함)
        const apyValues = [
            // 자주 사용되는 값들
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30, 40, 50,
            // 세밀한 값들
            1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 11, 13, 14, 16, 17, 19, 22, 28, 35, 45
        ];
        
        // 더 세밀한 커미션 범위 (필터에서 자주 사용되는 값들을 우선 포함)
        const commissionValues = [
            // 자주 사용되는 값들
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30, 40, 50,
            // 세밀한 값들
            0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 11, 13, 14, 16, 17, 19, 22, 28, 35, 45
        ];
        
        console.log('시나리오 생성 파라미터:', {
            delegationValues: delegationValues.length,
            apyValues: apyValues.length,
            commissionValues: commissionValues.length,
            totalCombinations: delegationValues.length * apyValues.length * commissionValues.length
        });
        
        // 허용 오차를 더 넓게 설정 (목표 수익의 5% 또는 최소 $50)
        const tolerance = Math.max(targetProfit * 0.05, 50);
        
        for (const delegation of delegationValues) {
            for (const apy of apyValues) {
                for (const commission of commissionValues) {
                    const delegationValue = calculator.calculateDelegationValue(delegation, tokenPrice);
                    const yearlyProfit = calculator.calculateYearlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
                    
                    // 목표 수익과 비교 (더 넓은 허용 오차)
                    if (Math.abs(yearlyProfit - targetProfit) <= tolerance) {
                        const monthlyProfit = calculator.calculateMonthlyProfit(delegationValue, apy, commission, monthlyOperatingCost);
                        scenarios.push({
                            delegation,
                            delegationValue,
                            apy,
                            commission,
                            monthlyOperatingCost,
                            monthlyProfit,
                            yearlyProfit
                        });
                        
                        console.log('시나리오 발견:', {
                            delegation,
                            delegationValue,
                            apy,
                            commission,
                            monthlyOperatingCost,
                            yearlyProfit,
                            targetProfit,
                            difference: Math.abs(yearlyProfit - targetProfit)
                        });
                    }
                }
            }
        }
        
        console.log('생성된 시나리오 수:', scenarios.length);
        
        // 중복 제거 (동일한 위임량, APY, 커미션 조합)
        const uniqueScenarios = scenarios.filter((scenario, index, self) => {
            const key = `${scenario.delegation}-${scenario.apy}-${scenario.commission}`;
            return index === self.findIndex(s => `${s.delegation}-${s.apy}-${s.commission}` === key);
        });
        
        console.log('중복 제거 후 시나리오 수:', uniqueScenarios.length);
        
        // 위임량 순으로 정렬
        return uniqueScenarios.sort((a, b) => a.delegation - b.delegation);
    }
};

// 팝업 관리
const popupManager = {
    showFormulaPopup: (type) => {
        console.log('팝업 표시:', type);
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
        console.log('팝업 닫기');
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
                <h4>기본 연 수익 계산</h4>
                <p><strong>기본 연 수익 = 위임 가치 × APY ÷ 100</strong></p>
            </div>
            <div class="formula-item">
                <h4>커미션 수익 계산</h4>
                <p><strong>커미션 수익 = 기본 연 수익 × 커미션 비율 ÷ 100</strong></p>
                <p><em>※ 커미션은 밸리데이터가 추가로 가져가는 수익입니다</em></p>
            </div>
            <div class="formula-item">
                <h4>총 연 수익 계산</h4>
                <p><strong>총 연 수익 = 기본 연 수익 + 커미션 수익</strong></p>
            </div>
            <div class="formula-item">
                <h4>순 연 수익 계산</h4>
                <p><strong>순 연 수익 = 총 연 수익 - (월간 운영 비용 × 12)</strong></p>
            </div>
            <div class="formula-item">
                <h4>월 수익 계산</h4>
                <p><strong>월 수익 = 순 연 수익 ÷ 12</strong></p>
            </div>
            <div class="formula-item">
                <h4>순 APY 계산</h4>
                <p><strong>순 APY = (순 연 수익 ÷ 위임 가치) × 100</strong></p>
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

// 초기화 함수
const initializeApp = () => {
    console.log('앱 초기화 시작...');
    
    // DOM이 완전히 로드될 때까지 대기
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM 로딩 완료');
            initializeElements();
            eventListeners.init();
        });
    } else {
        console.log('DOM이 이미 로드됨');
        initializeElements();
        eventListeners.init();
    }
};

// 앱 초기화 실행
initializeApp(); 