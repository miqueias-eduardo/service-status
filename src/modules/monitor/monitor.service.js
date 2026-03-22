import axios from "axios";
import {randomUUID} from 'crypto';
let loopMonitor = null;
let ativo = false;

let monitores=[];

function gerarId() {
  let id;

do {
    id = randomUUID();
  } while (monitores.some(m => m.id === id));

  return id;
}

async function checkApi(url) {
  const inicio = Date.now();
  let tempoResposta = 0;
  try {
    const api = await axios.get(url, {
      timeout: 10000,
    });
    tempoResposta = Date.now() - inicio;
    if (api) {
      const dados = {
        status: "online",
        tempoResposta: tempoResposta + "ms",
        codigoHttp:api.status,
        verificadoEm:new Date().toLocaleString("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium"
}),
      };
      return dados;
    }
  }
  catch (error) {
    let mensError = "";
    const tempoError = Date.now() - inicio;
    if (error.response) {
      mensError = `A API respondeu com erro (${error.response.status})`;
    } else if (error.request) {
      mensError = "A API não respondeu (timeout ou servidor fora do ar)";
    } else if (error.message) {
      mensError = error.message;
    }
    const dados = {
      status: "offline",
      tempoResposta: tempoError + "ms",
      motivo: mensError,
      verificadoEm:new Date().toLocaleString("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium"
}),
    };
    return dados;
  }
}

function adicionarMonitor(url,apelido){
  if (monitores.some(m => m.url === url)) {
    const erro = new Error('Essa URL já está sendo monitorada');
    erro.statusCode = 409;
    throw erro;
  }
  if (monitores.some(m => m.apelido === apelido)) {
    const erro = new Error('Esse apelido já está em uso');
    erro.statusCode = 409;
    throw erro;
  }

 const novoMonitor = {
    id: gerarId(),
    url,
    apelido,
    ultimoStatus:null
  };

   monitores.push(novoMonitor);
   return novoMonitor;
}

function listarMonitores(){
  return monitores;
}

function buscarPorId(id) {
  return monitores.find(m => m.id === id);
}

function buscarPorApelido(apelido) {
  return monitores.find(m => m.apelido === apelido);
}

async function iniciarMonitor(intervalo) {
 loopMonitor = setInterval(async () =>{
 for (let index = 0; index < monitores.length; index++) {
  let api = monitores[index]
  const resultado = await checkApi(api.url);
  api.ultimoStatus=resultado;
  console.log(`[${api.id}] ${api.apelido}`, resultado);
  }
 },intervalo)
 ativo = true;
 return true;
}

function pararMonitor(){
  clearInterval(loopMonitor);
  loopMonitor = null;
  ativo = false;
  return true;
}

 function statusMonitor(){
  return ativo;
 }

function deletarMonitor(id){
  const tamanhoAntes = monitores.length;
  monitores = monitores.filter(m => m.id !== id);
  return monitores.length < tamanhoAntes;
}

export { checkApi, adicionarMonitor, iniciarMonitor,
        deletarMonitor, listarMonitores, buscarPorId,
        buscarPorApelido,pararMonitor,statusMonitor}
