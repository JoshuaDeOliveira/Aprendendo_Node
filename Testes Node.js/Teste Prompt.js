const prompt = require('prompt-sync')();

const nome = prompt('qual o seu nome? ');

console.log(`Seja muito bem vindo "${nome}"!`)

var estudou = prompt('O que você estudou? ');

console.log(`${nome} então você estuda ${estudou}! Que maneiro!`)