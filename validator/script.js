// 1. 기본 계산기 요소들
const caseSelect = document.getElementById('case-select');
const fdvSelectUsd = document.getElementById('fdv-select-usd');
const fdvCustomUsd = document.getElementById('fdv-custom-usd');
const delegationUsdInput = document.getElementById('delegation-usd');
const apyUsdInput = document.getElementById('apy-usd');
const commissionUsdInput = document.getElementById('commission-usd');
const yearlyProfitUsdElement = document.getElementById('yearly-profit-usd');
const monthlyProfitUsdElement = document.getElementById('monthly-profit-usd');
const actualApyUsdElement = document.getElementById('actual-apy-usd');

// 토큰 기반 계산기 요소들
const fdvSelectToken = document.getElementById('fdv-select-token');
const fdvCustomToken = document.getElementById('fdv-custom-token');
const totalSupplySelect = document.getElementById('total-supply-select');
const totalSupplyCustom = document.getElementById('total-supply-custom');
const delegationTokenInput = document.getElementById('delegation-token');
const apyTokenInput = document.getElementById('apy-token');
const commissionTokenInput = document.getElementById('commission-token');
const yearlyProfitTokenElement = document.getElementById('yearly-profit-token');
const monthlyProfitTokenElement = document.getElementById('monthly-profit-token');
const actualApyTokenElement = document.getElementById('actual-apy-token');

// 2. 시나리오 분석 요소들
const targetProfitSelect = document.getElementById('target-profit-select');
const targetProfitCustom = document.getElementById('target-profit-custom');
const inputFdv = document.getElementById('input-fdv');
const inputTotalSupply = document.getElementById('input-total-supply');
const generateScenariosBtn = document.getElementById('generate-scenarios');
const scenariosGrid = document.getElementById('scenarios-grid');

// 케이스 선택 기능
function handleCaseSelection() {
    caseSelect.addEventListener('change', () => {
        const selectedCase = caseSelect.value;
        
        if (selectedCase === 'case1') {
            // 케이스 1: 달러 기반 계산
            document.getElementById('usd-calculator').style.display = 'block';
            document.getElementById('token-calculator').style.display = 'none';
            calculateProfitUsd();
        } else if (selectedCase === 'case2') {
            // 케이스 2: 토큰 기반 계산
            document.getElementById('usd-calculator').style.display = 'none';
            document.getElementById('token-calculator').style.display = 'block';
            calculateProfitToken();
        }
    });
}

// FDV 입력 처리 함수
function handleFdvInput(selectElement, customInput) {
    if (!selectElement || !customInput) return;
    
    selectElement.addEventListener('change', () => {
        if (selectElement.value === 'custom') {
            customInput.style.display = 'block';
            customInput.style.visibility = 'visible';
            customInput.style.opacity = '1';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
            customInput.style.visibility = 'hidden';
            customInput.style.opacity = '0';
            customInput.value = '';
        }
        
        // 계산 실행
        if (caseSelect.value === 'case1') {
            calculateProfitUsd();
        } else if (caseSelect.value === 'case2') {
            calculateProfitToken();
        }
    });
    
    customInput.addEventListener('input', () => {
        if (caseSelect.value === 'case1') {
            calculateProfitUsd();
        } else if (caseSelect.value === 'case2') {
            calculateProfitToken();
        }
    });
}

// 달러 기반 수익 계산
function calculateProfitUsd() {
    const fdv = getFdvValue(fdvSelectUsd, fdvCustomUsd);
    const delegation = parseFloat(delegationUsdInput.value) || 0;
    const apy = parseFloat(apyUsdInput.value) || 0;
    const commission = parseFloat(commissionUsdInput.value) || 0;
    
    const yearlyProfit = delegation * (apy / 100) * (1 - commission / 100);
    const monthlyProfit = yearlyProfit / 12;
    const actualApy = (yearlyProfit / delegation) * 100;
    
    yearlyProfitUsdElement.textContent = formatCurrency(yearlyProfit);
    monthlyProfitUsdElement.textContent = formatCurrency(monthlyProfit);
    actualApyUsdElement.textContent = actualApy.toFixed(2) + '%';
}

// 토큰 기반 수익 계산
function calculateProfitToken() {
    const fdv = getFdvValue(fdvSelectToken, fdvCustomToken);
    const totalSupply = getTotalSupplyValue();
    const tokenAmount = parseInt(delegationTokenInput.getAttribute('data-original-value')) || 0;
    const apy = parseFloat(apyTokenInput.value) || 0;
    const commission = parseFloat(commissionTokenInput.value) || 0;
    
    const tokenPrice = totalSupply > 0 ? fdv / totalSupply : 0;
    const delegationUSD = tokenAmount * tokenPrice;
    const yearlyProfit = delegationUSD * (apy / 100) * (1 - commission / 100);
    const monthlyProfit = yearlyProfit / 12;
    const actualApy = (yearlyProfit / delegationUSD) * 100;
    
    yearlyProfitTokenElement.textContent = formatCurrency(yearlyProfit);
    monthlyProfitTokenElement.textContent = formatCurrency(monthlyProfit);
    actualApyTokenElement.textContent = actualApy.toFixed(2) + '%';
}

// FDV 값 가져오기
function getFdvValue(selectElement, customInput) {
    if (selectElement.value === 'custom') {
        return parseFloat(customInput.value) || 0;
    } else {
        return parseFloat(selectElement.value) || 0;
    }
}

// 총 발행량 값 가져오기
function getTotalSupplyValue() {
    if (totalSupplySelect.value === 'custom') {
        return parseFloat(totalSupplyCustom.value) || 0;
    } else {
        return parseFloat(totalSupplySelect.value) || 0;
    }
}

// 숫자에 쉼표 추가
function addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 쉼표 제거
function removeCommas(str) {
    return str.replace(/,/g, '');
}

// 토큰 가격 포맷팅
function formatTokenPrice(price) {
    if (price < 0.000001) {
        return '$' + price.toExponential(6);
    } else if (price < 0.01) {
        return '$' + price.toFixed(6);
    } else if (price < 1) {
        return '$' + price.toFixed(4);
    } else {
        return '$' + price.toFixed(2);
    }
}

// 목표 수익 입력 처리
function handleTargetProfitInput() {
    targetProfitSelect.addEventListener('change', () => {
        if (targetProfitSelect.value === 'custom') {
            targetProfitCustom.style.display = 'block';
            targetProfitCustom.style.visibility = 'visible';
            targetProfitCustom.style.opacity = '1';
            targetProfitCustom.focus();
        } else {
            targetProfitCustom.style.display = 'none';
            targetProfitCustom.style.visibility = 'hidden';
            targetProfitCustom.style.opacity = '0';
            targetProfitCustom.value = '';
        }
    });
    
    targetProfitCustom.addEventListener('input', () => {
        console.log('Target profit custom input:', targetProfitCustom.value);
    });
}

// 목표 수익 값 가져오기
function getTargetProfitValue() {
    if (targetProfitSelect.value === 'custom') {
        return parseFloat(targetProfitCustom.value) || 0;
    } else {
        return parseFloat(targetProfitSelect.value) || 0;
    }
}

// 통화 포맷팅 함수
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// 시나리오 생성 함수
function generateScenarios() {
    const targetProfit = getTargetProfitValue();
    const fdv = parseFloat(inputFdv.value);
    const totalSupply = parseFloat(inputTotalSupply.value);
    const count = 10; // 기본 10개
    const range = 'moderate'; // 기본값

    if (!targetProfit || !fdv || !totalSupply) {
        scenariosGrid.innerHTML = '<div class="placeholder-message">목표 수익, FDV, 총 발행량을 모두 입력해주세요.</div>';
        return;
    }

    const scenarios = createScenarios(targetProfit, fdv, totalSupply, range, count);
    displayScenarios(scenarios);
}

// 시나리오 생성 로직 (FDV, 총발행량 고정)
function createScenarios(targetProfit, fdv, totalSupply, range, count) {
    const scenarios = [];
    // APY, 커미션, 위임량만 조합
    const apyRange = [8, 10, 12, 15, 18, 20, 25, 30];
    const commissionRange = [5, 8, 10, 12, 15, 18, 20];
    
    for (let i = 0; i < apyRange.length; i++) {
        for (let j = 0; j < commissionRange.length; j++) {
            const apy = apyRange[i];
            const commission = commissionRange[j];
            const tokenPrice = fdv / totalSupply;
            // 목표 수익을 달성하기 위한 위임 USD
            const requiredDelegationUSD = targetProfit / (apy / 100) / (1 - commission / 100);
            const requiredDelegationTokens = requiredDelegationUSD / tokenPrice;
            const actualYearlyProfit = requiredDelegationUSD * (apy / 100) * (1 - commission / 100);
            const actualMonthlyProfit = actualYearlyProfit / 12;
            const actualApy = (actualYearlyProfit / requiredDelegationUSD) * 100;
            const difference = Math.abs(actualYearlyProfit - targetProfit);
            const tolerance = targetProfit * 0.15;
            
            if (difference <= tolerance && requiredDelegationTokens > 0) {
                scenarios.push({
                    fdv,
                    totalSupply,
                    tokenPrice,
                    requiredDelegationTokens: Math.round(requiredDelegationTokens),
                    requiredDelegationUSD,
                    apy,
                    commission,
                    actualYearlyProfit,
                    actualMonthlyProfit,
                    actualApy,
                    difference
                });
            }
        }
    }
    scenarios.sort((a, b) => a.difference - b.difference);
    return scenarios.slice(0, count);
}

// 시나리오 표시 함수
function displayScenarios(scenarios) {
    if (scenarios.length === 0) {
        scenariosGrid.innerHTML = '<div class="placeholder-message">목표 수익을 달성할 수 있는 시나리오를 찾을 수 없습니다. 다른 조건을 시도해보세요.</div>';
        return;
    }
    
    scenariosGrid.innerHTML = '';
    
    scenarios.forEach((scenario, index) => {
        const scenarioCard = document.createElement('div');
        scenarioCard.className = 'scenario-card';
        
        scenarioCard.innerHTML = `
            <div class="scenario-header">
                <div class="scenario-title">시나리오 ${index + 1}</div>
                <div class="scenario-type moderate">보통</div>
            </div>
            <div class="scenario-details">
                <div class="scenario-item">
                    <span class="scenario-label">FDV:</span>
                    <span class="scenario-value">${formatCurrency(scenario.fdv)}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">총 발행량:</span>
                    <span class="scenario-value">${addCommas(scenario.totalSupply)}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">토큰 가격:</span>
                    <span class="scenario-value">${formatTokenPrice(scenario.tokenPrice)}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">필요한 위임량:</span>
                    <span class="scenario-value">${addCommas(scenario.requiredDelegationTokens)} 토큰</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">위임량 (USD):</span>
                    <span class="scenario-value">${formatCurrency(scenario.requiredDelegationUSD)}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">APY:</span>
                    <span class="scenario-value">${scenario.apy}%</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">커미션:</span>
                    <span class="scenario-value">${scenario.commission}%</span>
                </div>
            </div>
            <div class="scenario-results">
                <div class="result-item">
                    <div class="result-label">실제 연 수익</div>
                    <div class="result-value">${formatCurrency(scenario.actualYearlyProfit)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">실제 월 수익</div>
                    <div class="result-value">${formatCurrency(scenario.actualMonthlyProfit)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">실제 APY</div>
                    <div class="result-value">${scenario.actualApy.toFixed(2)}%</div>
                </div>
                <div class="result-item">
                    <div class="result-label">목표 대비 차이</div>
                    <div class="result-value">${formatCurrency(scenario.difference)}</div>
                </div>
            </div>
        `;
        
        scenariosGrid.appendChild(scenarioCard);
    });
}

// 목표 수익 변경 이벤트 핸들러
function handleTargetProfitChange() {
    if (targetProfitSelect.value === 'custom') {
        targetProfitCustom.style.display = 'block';
        targetProfitCustom.style.visibility = 'visible';
        targetProfitCustom.style.opacity = '1';
        targetProfitCustom.focus();
    } else {
        targetProfitCustom.style.display = 'none';
        targetProfitCustom.style.visibility = 'hidden';
        targetProfitCustom.style.opacity = '0';
        targetProfitCustom.value = '';
    }
}

function handleTargetProfitCustomChange() {
    // 시나리오가 이미 생성되어 있다면 자동으로 업데이트
    if (scenariosGrid.children.length > 0 && !scenariosGrid.querySelector('.placeholder-message')) {
        generateScenarios();
    }
}

// 재단 위임량 쉼표 표시 처리 (토큰 기반)
function handleDelegationTokenInput() {
    // 초기값 설정
    if (delegationTokenInput) {
        delegationTokenInput.value = '500,000';
        delegationTokenInput.setAttribute('data-original-value', '500000');
    }
    
    delegationTokenInput.addEventListener('input', (e) => {
        let value = e.target.value;
        // 쉼표 제거
        value = removeCommas(value);
        // 숫자만 허용
        value = value.replace(/[^\d]/g, '');
        
        if (value) {
            const numValue = parseInt(value);
            // 쉼표 추가하여 표시
            e.target.value = addCommas(numValue);
            // 원본 값 저장
            e.target.setAttribute('data-original-value', numValue);
        } else {
            e.target.value = '';
            e.target.setAttribute('data-original-value', '0');
        }
        
        calculateProfitToken();
    });
    
    delegationTokenInput.addEventListener('blur', (e) => {
        const value = e.target.getAttribute('data-original-value') || '0';
        if (value === '0') {
            e.target.value = '';
        }
    });
}

// 총 발행량 입력 처리
function handleTotalSupplyInput(selectElement, customInput) {
    if (!selectElement || !customInput) return;
    
    selectElement.addEventListener('change', () => {
        if (selectElement.value === 'custom') {
            customInput.style.display = 'block';
            customInput.style.visibility = 'visible';
            customInput.style.opacity = '1';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
            customInput.style.visibility = 'hidden';
            customInput.style.opacity = '0';
            customInput.value = '';
        }
        
        calculateProfitToken();
    });
    
    customInput.addEventListener('input', () => {
        calculateProfitToken();
    });
}

// 이벤트 리스너 등록
function initializeEventListeners() {
    // 케이스 선택
    handleCaseSelection();
    
    // FDV 입력 처리
    handleFdvInput(fdvSelectUsd, fdvCustomUsd);
    handleFdvInput(fdvSelectToken, fdvCustomToken);
    
    // 달러 기반 계산기 이벤트
    delegationUsdInput.addEventListener('input', calculateProfitUsd);
    apyUsdInput.addEventListener('input', calculateProfitUsd);
    commissionUsdInput.addEventListener('input', calculateProfitUsd);
    
    // 토큰 기반 계산기 이벤트
    delegationTokenInput.addEventListener('input', calculateProfitToken);
    apyTokenInput.addEventListener('input', calculateProfitToken);
    commissionTokenInput.addEventListener('input', calculateProfitToken);
    
    // 목표 수익 입력 처리
    handleTargetProfitInput();
    
    // 시나리오 분석 이벤트
    targetProfitSelect.addEventListener('change', handleTargetProfitChange);
    targetProfitCustom.addEventListener('input', handleTargetProfitCustomChange);
    generateScenariosBtn.addEventListener('click', generateScenarios);
    
    // 총 발행량 입력 처리
    handleTotalSupplyInput(totalSupplySelect, totalSupplyCustom);

    // 재단 위임량 쉼표 표시 처리
    handleDelegationTokenInput();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    initializeEventListeners();
    calculateProfitUsd();
}); 