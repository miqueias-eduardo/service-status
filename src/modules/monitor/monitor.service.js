import axios from "axios";
import {randomUUID} from "crypto";
import db from "../../infra/database.js"
let loopMonitor = null;
let ativo = false;

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
  if ( db.prepare('SELECT id FROM monitores WHERE url = ?').get(url)) {
    const erro = new Error('Essa URL já está sendo monitorada');
    erro.statusCode = 409;
    throw erro;
  }
  if (db.prepare('SELECT id  FROM monitores WHERE apelido = ?').get(apelido)) {
    const erro = new Error('Esse apelido já está em uso');
    erro.statusCode = 409;
    throw erro;
  }

 const novoMonitor = {
    id:randomUUID(),
    url,
    apelido,
    ultimoStatus:null
  };

  const id = novoMonitor.id;

   db.prepare('INSERT INTO monitores (id, url , apelido) VALUES (?, ?, ?)').run(id, url, apelido);
   return novoMonitor;
}

function listarMonitores(){
 const monitores = db.prepare('SELECT * FROM monitores').all()
 // converte o ultimoStatus de string para objeto em cada monitor
 return monitores.map(m => ({
   ...m,
    ultimoStatus: m.ultimoStatus ? JSON.parse(m.ultimoStatus) : null
 }))
}

function buscarPorId(id) {
  const resultado = db.prepare('SELECT * FROM monitores WHERE id = ?').get(id);
  if (!resultado) return null;
  return {...resultado,
  ultimoStatus: resultado.ultimoStatus ? JSON.parse(resultado.ultimoStatus) : null
  }
}

function buscarPorApelido(apelido) {
  const resultado = db.prepare('SELECT * FROM monitores WHERE apelido = ?').get(apelido);
  if (!resultado) return null;
  return {...resultado,
  ultimoStatus: resultado.ultimoStatus ? JSON.parse(resultado.ultimoStatus) : null
  }
}

async function iniciarMonitor(intervalo) {
 loopMonitor = setInterval(async () =>{
  const monitores = db.prepare('SELECT * FROM monitores').all()
 for (let index = 0; index < monitores.length; index++) {
  let api = monitores[index]
  const resultado = await checkApi(api.url);
  db.prepare('UPDATE monitores SET ultimoStatus = ? WHERE id = ?').run(JSON.stringify(resultado), api.id)
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
  const resultado = db.prepare('DELETE FROM monitores WHERE id = ?').run(id)
  return resultado.changes > 0;
}

export { checkApi, adicionarMonitor, iniciarMonitor,
        deletarMonitor, listarMonitores, buscarPorId,
        buscarPorApelido,pararMonitor,statusMonitor}
