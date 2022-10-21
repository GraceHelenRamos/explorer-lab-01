import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type){

//estrutura de dados para diferenciar a cor pelas bandeira do cartão
const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
    cielo: ["#4FD795", "#D1FB2A"]
}

ccBgColor01.setAttribute("fill", colors[type][0])
ccBgColor02.setAttribute("fill", colors[type][1])
ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType; 

//security code, o IMask precisa do campo e da mascara 
//campo
const securityCode = document.querySelector("#security-code");
//mascara
const securityCodePattern = {
    mask:"0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

//expiration date
const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY:{
            mask:IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM:{
        mask:IMask.MaskedRange,
        from:1,
        to:12,
        }
        
    }
}
const expirationDateMask = IMask(expirationDate, expirationDatePattern);

//num card
const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
    mask: [
       { 
        mask: "0000 0000 0000 0000",
        regex: /^4\d{0,15}/, 
        cardtype: "visa",
        },
       { 
        mask: "0000 0000 0000 0000",
        regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
        cardtype: "mastercard",
        },
       { 
        mask: "0000 0000 0000 0000",
        cardtype: "default",
        },
    ],
    //appended = tecla que for precionada no teclado
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        const foundMask = dynamicMasked.compiledMasks.find(function (item){
            return number.match(item.regex)
        })
        return foundMask
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

//button
const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", ()=> {
    alert("Cartão Adicionada");
});

document.querySelector("form").addEventListener("submit", (event) =>{
    event.preventDefault();
})

//pegando o nome do titular 
const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", ()=> {
    const ccHolder = document.querySelector(".cc-holder .value");

    //mudando o valor do titular no cartão
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

//pegando o CVC e trocando o valor no cartão
securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

//pegando o Numero do cartão e mudando o cartão dependendo do tipo do cartão
cardNumberMasked.on("accept", () => {
    const cType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cType)
    updateCardNumber(cardNumberMasked.value)
});
function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}
//data de expiração
expirationDateMask.on("accept", () => {
 
    updateExpirationDate(expirationDateMask.value)
});
function updateExpirationDate(date) {
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}


