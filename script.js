document.addEventListener("DOMContentLoaded", () => {
    carregarGraficos();
    carregarMapa();
    atualizarAlertas();
    setInterval(atualizarAlertas, 10000);
    gerenciarScroll();
    document.getElementById('cadastro-form').addEventListener('submit', mostrarPopup);
});

function gerarAlertaAleatorio() {
    const estados = ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Santa Catarina', 'Rio Grande do Sul'];
    const precipitacoes = ['5 mm', '10 mm', '15 mm', '20 mm', '25 mm'];
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const precipitacao = precipitacoes[Math.floor(Math.random() * precipitacoes.length)];
    const hora = new Date().toLocaleTimeString();
    const diaOuNoite = (new Date().getHours() >= 6 && new Date().getHours() < 18) ? 'Dia' : 'Noite';

    return {
        estado: estado,
        hora: hora,
        precipitacao: precipitacao,
        diaOuNoite: diaOuNoite
    };
}

function atualizarAlertas() {
    const alertasDiv = document.getElementById('alertas');
    alertasDiv.innerHTML = '';

    for (let i = 0; i < 3; i++) { 
        const alerta = gerarAlertaAleatorio();
        const alertaElement = document.createElement('div');
        alertaElement.className = 'alerta';
        alertaElement.innerHTML = `
            <h3>Alerta ${i + 1}</h3>
            <p><strong>Estado:</strong> ${alerta.estado}</p>
            <p><strong>Hora:</strong> ${alerta.hora}</p>
            <p><strong>Precipitação:</strong> ${alerta.precipitacao}</p>
            <p><strong>Período:</strong> ${alerta.diaOuNoite}</p>
        `;
        alertasDiv.appendChild(alertaElement);
    }
}

function carregarGraficos() {
    const ctx1 = document.getElementById('grafico1').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Ocorrências de Desastres',
                data: [30, 45, 28, 50, 70, 90, 55, 60, 48, 76, 80, 60],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    const ctx2 = document.getElementById('grafico2').getContext('2d');
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
            datasets: [{
                label: 'Nível de Risco de Desastres',
                data: [60, 50, 80, 70, 40],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function carregarMapa() {
const map = L.map('mapa').setView([-15.7801, -47.9292], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 18,
attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const regioes = [
{ name: "São Paulo", coordinates: [
    [-23.5, -46.6], [-23.5, -46.0], [-23.0, -46.0], [-23.0, -46.6]
], risk: 'alto' },
{ name: "Rio de Janeiro", coordinates: [
    [-22.0, -43.5], [-22.0, -43.0], [-21.5, -43.0], [-21.5, -43.5]
], risk: 'médio' },
{ name: "Minas Gerais", coordinates: [
    [-20.5, -43.5], [-20.5, -43.0], [-20.0, -43.0], [-20.0, -43.5]
], risk: 'baixo' }

];

const coresRisco = {
alto: '#FF6F61',
médio: '#FFABAB',
baixo: '#FFD700'
};

regioes.forEach(r => {
L.polygon(r.coordinates, { color: 'blue', fillColor: coresRisco[r.risk], fillOpacity: 0.5 })
    .bindPopup(`${r.name} - Risco ${r.risk.charAt(0).toUpperCase() + r.risk.slice(1)}`)
    .addTo(map);
});

const legenda = L.control({ position: 'bottomright' });

legenda.onAdd = function () {
const div = L.DomUtil.create('div', 'info legend');
const riscos = ['alto', 'médio', 'baixo'];
const labels = [];

riscos.forEach(r => {
    labels.push(
        `<i class="legend-bullet" style="background: ${coresRisco[r]}"></i> ${r.charAt(0).toUpperCase() + r.slice(1)}`
    );
});

div.innerHTML = '<h4>Nível de Risco</h4>' + labels.join('<br>');
return div;
};

legenda.addTo(map);
}

function mostrarPopup(event) {
    event.preventDefault();
    const popup = document.getElementById('popup');
    popup.classList.add('active');
}

function gerenciarScroll() {
    const footer = document.querySelector('footer');
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            footer.classList.remove('hidden');
        } else {
            footer.classList.add('hidden');
        }
    });
}

function fecharPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('active');
    document.getElementById("name").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";

}