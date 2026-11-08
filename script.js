// ==========================================
// MARATONA TECH
// DESINFORMAÇÃO EM SAÚDE
// KARINA COSTA NUNES · 2026
// ==========================================


// ==========================================
// 1. DADOS DA PESQUISA
// ==========================================

const TOTAL_PARTICIPANTES = 30;

const colors = [
  '#397FCA',
  '#E47782',
  '#F2A36F',
  '#91AD9A',
  '#9565B8'
];

const researchData = {

  q1: {

    labels: [
      'Sim',
      'Não',
      'Às vezes',
      'Raramente',
      'Nunca'
    ],

    values: [10, 7, 6, 4, 3]

  },

  q2: {

    labels: [
      'Sim',
      'Não',
      'Talvez',
      'Raramente',
      'Nunca'
    ],

    values: [9, 9, 6, 2, 4]

  }

};


// ==========================================
// 2. CÁLCULO DOS PERCENTUAIS
// ==========================================

function getPercentage(value) {

  const result = (
    value / TOTAL_PARTICIPANTES
  ) * 100;

  return result
    .toFixed(1)
    .replace('.', ',') + '%';

}


// ==========================================
// 3. MENSAGENS INTERATIVAS
// ==========================================

function showMessage(message) {

  let toast = document.getElementById('toast');

  if (!toast) {

    toast = document.createElement('div');

    toast.id = 'toast';

    toast.className = 'toast';

    document.body.appendChild(toast);

  }

  toast.textContent = message;

  toast.classList.add('show');

  clearTimeout(window.messageTimeout);

  window.messageTimeout = setTimeout(() => {

    toast.classList.remove('show');

  }, 2500);

}


// ==========================================
// 4. CRIAÇÃO DAS LEGENDAS
// ==========================================

function createLegend(elementId, data) {

  const element = document.getElementById(elementId);

  if (!element) return;

  if (data.labels.length === 0) {

    element.innerHTML = `
      <li class="no-data">
        Esta resposta não aparece nesta pergunta.
      </li>
    `;

    return;

  }

  element.innerHTML = data.labels.map(
    (label, index) => {

      const color = data.colors
        ? data.colors[index]
        : colors[index % colors.length];

      return `

        <li>

          <span
            class="legend-dot"
            style="background-color: ${color}">
          </span>

          <span>${label}</span>

          <small>
            ${getPercentage(data.values[index])}
          </small>

        </li>

      `;

    }
  ).join('');

}


// ==========================================
// 5. CONFIGURAÇÃO DOS GRÁFICOS
// ==========================================

const commonOptions = {

  responsive: true,

  maintainAspectRatio: false,

  cutout: '62%',

  animation: {

    duration: 900,

    animateRotate: true,

    animateScale: true

  },

  plugins: {

    legend: {

      display: false

    },

    tooltip: {

      backgroundColor: '#205B9C',

      titleFont: {

        family: 'DM Sans',

        size: 13

      },

      bodyFont: {

        family: 'DM Sans',

        size: 12

      },

      padding: 12,

      cornerRadius: 10,

      callbacks: {

        label: function(context) {

          const quantidade = context.raw;

          return (
            ` ${quantidade} respostas · ` +
            getPercentage(quantidade)
          );

        }

      }

    }

  }

};


// ==========================================
// 6. CRIAÇÃO DOS GRÁFICOS
// ==========================================

function createChart(canvasId, data) {

  const canvas = document.getElementById(canvasId);

  if (!canvas) return null;

  if (typeof Chart === 'undefined') {

    console.error(
      'Chart.js não foi carregado.'
    );

    showMessage(
      'Não foi possível carregar os gráficos.'
    );

    return null;

  }

  return new Chart(canvas, {

    type: 'doughnut',

    data: {

      labels: [...data.labels],

      datasets: [{

        data: [...data.values],

        backgroundColor: [...colors],

        borderColor: '#FFFFFF',

        borderWidth: 3,

        hoverOffset: 10,

        spacing: 1

      }]

    },

    options: {

      ...commonOptions,

      onClick: function(event, elements, chart) {

        if (!elements.length) return;

        const index = elements[0].index;

        const label = chart.data.labels[index];

        const value = chart.data.datasets[0].data[index];

        showMessage(
          `${label}: ${value} participantes ` +
          `(${getPercentage(value)}).`
        );

      }

    }

  });

}


// ==========================================
// 7. INICIALIZAÇÃO DOS GRÁFICOS
// ==========================================

const chartOne = createChart(
  'chartOne',
  researchData.q1
);

const chartTwo = createChart(
  'chartTwo',
  researchData.q2
);

createLegend(
  'legendOne',
  researchData.q1
);

createLegend(
  'legendTwo',
  researchData.q2
);


// ==========================================
// 8. FILTRO ORIGINAL DE PERGUNTAS
// ==========================================

const questionFilter = document.getElementById(
  'questionFilter'
);

const cardOne = document.getElementById(
  'card-q1'
);

const cardTwo = document.getElementById(
  'card-q2'
);


function applyQuestionFilter() {

  if (
    !questionFilter ||
    !cardOne ||
    !cardTwo
  ) return;

  const selected = questionFilter.value;

  cardOne.classList.toggle(
    'is-hidden',
    selected === 'q2'
  );

  cardTwo.classList.toggle(
    'is-hidden',
    selected === 'q1'
  );

  if (selected === 'all') {

    showMessage(
      'Exibindo todas as perguntas.'
    );

  } else if (selected === 'q1') {

    showMessage(
      'Exibindo a primeira pergunta.'
    );

  } else {

    showMessage(
      'Exibindo a segunda pergunta.'
    );

  }

  setTimeout(() => {

    if (chartOne) chartOne.resize();

    if (chartTwo) chartTwo.resize();

  }, 180);

}


if (questionFilter) {

  questionFilter.addEventListener(
    'change',
    applyQuestionFilter
  );

}


// ==========================================
// 9. FILTRO DE RESPOSTAS
// ==========================================

const answerFilter = document.getElementById(
  'answerFilter'
);


// ==========================================
// 10. PREPARAÇÃO DOS DADOS FILTRADOS
// ==========================================

function getFilteredData(originalData, question) {

  const selectedAnswer = answerFilter
    ? answerFilter.value
    : 'all';


  // TODAS AS RESPOSTAS

  if (selectedAnswer === 'all') {

    return {

      labels: [...originalData.labels],

      values: [...originalData.values],

      colors: [...colors],

      total: TOTAL_PARTICIPANTES,

      isFiltered: false

    };

  }


  // AGRUPAMENTO PARA ANÁLISE

  if (selectedAnswer === 'influencia') {

    let groupedLabels = [];

    let groupedValue = 0;

    let groupedTitle = '';


    if (question === 'q1') {

      groupedLabels = [
        'Sim',
        'Às vezes'
      ];

      groupedTitle = 'Sim + Às vezes';

    }


    if (question === 'q2') {

      groupedLabels = [
        'Sim',
        'Talvez'
      ];

      groupedTitle = 'Sim + Talvez';

    }


    originalData.labels.forEach(
      (label, index) => {

        if (groupedLabels.includes(label)) {

          groupedValue += originalData.values[index];

        }

      }
    );


    const otherValue =
      TOTAL_PARTICIPANTES - groupedValue;


    return {

      labels: [
        groupedTitle,
        'Demais respostas'
      ],

      values: [
        groupedValue,
        otherValue
      ],

      colors: [
        '#397FCA',
        '#D9E4EF'
      ],

      total: groupedValue,

      isFiltered: true

    };

  }


  // RESPOSTAS INDIVIDUAIS

  const filteredLabels = [];

  const filteredValues = [];

  const filteredColors = [];


  originalData.labels.forEach(
    (label, index) => {

      if (label === selectedAnswer) {

        filteredLabels.push(label);

        filteredValues.push(
          originalData.values[index]
        );

        filteredColors.push(
          colors[index % colors.length]
        );

      }

    }
  );


  const total = filteredValues.reduce(
    (sum, value) => sum + value,
    0
  );


  return {

    labels: filteredLabels,

    values: filteredValues,

    colors: filteredColors,

    total: total,

    isFiltered: true

  };

}


// ==========================================
// 11. ATUALIZAÇÃO DOS GRÁFICOS
// ==========================================

function updateFilteredChart(
  chart,
  originalData,
  legendId,
  totalId,
  totalLabelId,
  question
) {

  if (!chart) return;

  const filteredData = getFilteredData(
    originalData,
    question
  );


  // ATUALIZA GRÁFICO

  chart.data.labels = filteredData.labels;

  chart.data.datasets[0].data =
    filteredData.values;

  chart.data.datasets[0].backgroundColor =
    filteredData.colors;

  chart.update();


  // ATUALIZA LEGENDA

  createLegend(
    legendId,
    filteredData
  );


  // ATUALIZA QUANTIDADE

  const totalElement = document.getElementById(
    totalId
  );

  if (totalElement) {

    totalElement.textContent =
      filteredData.total;

  }


  // ATUALIZA TEXTO DO TOTAL

  const totalLabel = document.getElementById(
    totalLabelId
  );

  if (totalLabel) {

    totalLabel.textContent =
      filteredData.isFiltered
        ? 'Respostas selecionadas'
        : 'Total de respostas';

  }

}


// ==========================================
// 12. EXECUÇÃO DO FILTRO DE RESPOSTAS
// ==========================================

function applyAnswerFilter() {

  if (!answerFilter) return;


  // GRÁFICO 01

  updateFilteredChart(
    chartOne,
    researchData.q1,
    'legendOne',
    'totalOne',
    'totalLabelOne',
    'q1'
  );


  // GRÁFICO 02

  updateFilteredChart(
    chartTwo,
    researchData.q2,
    'legendTwo',
    'totalTwo',
    'totalLabelTwo',
    'q2'
  );


  // MENSAGENS

  const selectedAnswer = answerFilter.value;

  if (selectedAnswer === 'all') {

    showMessage(
      'Exibindo todas as respostas.'
    );

  } else if (selectedAnswer === 'influencia') {

    showMessage(
      'Exibindo respostas agrupadas para análise.'
    );

  } else {

    showMessage(
      `Filtrando resposta: ${selectedAnswer}.`
    );

  }

}


// EVENTO DO FILTRO

if (answerFilter) {

  answerFilter.addEventListener(
    'change',
    applyAnswerFilter
  );

}


// ==========================================
// 13. ANÁLISE DOS RESULTADOS
// ==========================================

document.querySelectorAll(
  '.explain-button'
).forEach(button => {

  button.addEventListener(
    'click',
    function() {

      const targetId = this.dataset.target;

      const detail = document.getElementById(
        targetId
      );

      if (!detail) return;

      const opened = detail.classList.toggle(
        'open'
      );

      this.classList.toggle(
        'active',
        opened
      );

      this.setAttribute(
        'aria-expanded',
        String(opened)
      );

      this.innerHTML = opened

        ? 'Fechar análise <span>×</span>'

        : 'Analisar resultado <span>↗</span>';

    }
  );

});


// ==========================================
// 14. MODO ESCURO
// ==========================================

const themeToggle = document.getElementById(
  'themeToggle'
);

if (themeToggle) {

  themeToggle.addEventListener(
    'click',
    function() {

      document.body.classList.toggle(
        'dark-mode'
      );

      const isDark = document.body.classList.contains(
        'dark-mode'
      );

      this.textContent = isDark
        ? '☀'
        : '☾';

      this.setAttribute(
        'aria-label',
        isDark
          ? 'Ativar modo claro'
          : 'Ativar modo escuro'
      );

    }
  );

}


// ==========================================
// 15. VOLTAR AO INÍCIO
// ==========================================

const backTop = document.getElementById(
  'backTop'
);

if (backTop) {

  backTop.addEventListener(
    'click',
    function() {

      window.scrollTo({

        top: 0,

        behavior: 'smooth'

      });

    }
  );

}


// ==========================================
// FIM DO SCRIPT
// KARINA COSTA NUNES · 2026
// ==========================================