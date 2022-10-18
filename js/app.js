const cryptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const form = document.getElementById('formulario');
const res = document.getElementById('resultado');


const objSearch = {
    money: '',
    crypto: ''
}



const getCryptoMoney = cryptos => new Promise( resolve => {
    resolve(cryptos)
});

document.addEventListener('DOMContentLoaded', () => {
    queryCrypto();

    form.addEventListener('submit', submitForm);

    cryptoSelect.addEventListener('change', readValue)
    monedaSelect.addEventListener('change', readValue)
})

function queryCrypto() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';

    fetch(url)
        .then(res => res.json())
        .then(resul => getCryptoMoney(resul.Data))
        .then( cryptos => selectCrypto(cryptos))
}

function selectCrypto(cryptos) {
    cryptos.forEach(crypto => {
        const { FullName, Name} = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName
        cryptoSelect.appendChild(option)
    });
}

function readValue(e) {
    objSearch[e.target.name] = e.target.value
    // console.log(objSearch)
}

function submitForm(e) {
    e.preventDefault();

    //Validar
    const {money, crypto} = objSearch;

    if(money === '' || crypto === '') {
        showAlert('Ambos campos son obligatorios')
        return;
    }

    //Consulta la API

    queryAPI()
}

function showAlert(message) {
    const existError = document.querySelector('.error')

    if(!existError) {
        const divMessage = document.createElement('div');
        divMessage.classList.add('error');
        divMessage.textContent = message
    
        form.appendChild(divMessage);
    
        setTimeout(() => {
            divMessage.remove()
        }, 3000);
    }
    
}

function queryAPI() {
    const { money, crypto} = objSearch;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${money}`

    showSpinner()

    fetch(url)
        .then(res => res.json())
        .then(coti => {
            showCotiHTML(coti.DISPLAY[crypto][money])
        })
}

function showCotiHTML(coti) {

    clearHTML()
    console.log(coti)
    const { PRICE, CHANGEDAY, CHANGEHOUR, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = coti

    const price = document.createElement('p');
    price.classList.add('precio');
    price.innerHTML = `El precio es <span>${PRICE}</span>`;

    const priceHigh = document.createElement('p');
    priceHigh.innerHTML = `<p>Precio mas alto del dia es <span>${HIGHDAY}</span> </p>`

    const priceLow = document.createElement('p');
    priceLow.innerHTML = `<p>Precio mas bajo del dia es <span>${LOWDAY}</span> </p>`

    const endHours = document.createElement('p');
    endHours.innerHTML = `<p>Precio de variacion  en las ultimas horas es <span>${CHANGEHOUR}</span> </p>`

    const priceChangeDay = document.createElement('p');
    priceChangeDay.innerHTML = `<p>Precio de variacion del ultimo dia es  es <span>${CHANGEDAY}</span> </p>`

    const priceChangePct = document.createElement('p');
    priceChangePct.innerHTML = `<p>Precio que ha subido en porcentaje de el ultimo dia es <span>  ${CHANGEPCT24HOUR} %</span> </p>`

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `<p>Ultima actualizacion (en ingles) <span>  ${LASTUPDATE} </span> </p>`

    res.appendChild(price)
    res.appendChild(priceHigh)
    res.appendChild(priceLow)
    res.appendChild(endHours)
    res.appendChild(priceChangeDay)
    res.appendChild(priceChangePct)
    res.appendChild(lastUpdate)
}

function clearHTML() {
    while(res.firstChild) {
        res.removeChild(res.firstChild)
    }
}

function showSpinner() {
    clearHTML()

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    spinner.innerHTML = `
            <div class="spinner"></div>
    
    `;

    res.appendChild(spinner)
}
