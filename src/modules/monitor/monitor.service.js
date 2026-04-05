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

async function adicionarMonitor(url,apelido){
  const existeUrl = await db.query('SELECT id FROM monitores WHERE url = $1',[url]);
  if (existeUrl.rows[0]) {
    const erro = new Error('Essa URL já está sendo monitorada');
    erro.statusCode = 409;
    throw erro;
  }
  const existeApelido = await db.query('SELECT id  FROM monitores WHERE apelido = $1', [apelido]);
  if (existeApelido.rows[0]) {
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

   await db.query('INSERT INTO monitores (id, url , apelido) VALUES ($1, $2, $3)', [id, url, apelido]);
   return novoMonitor;
}

async function listarMonitores(){
 const monitores = await db.query('SELECT id, url, apelido, ultimo_status AS "ultimoStatus" FROM monitores')
 // converte o ultimoStatus de string para objeto em cada monitor
 return monitores.rows.map(m => ({
   ...m,
    ultimoStatus: m.ultimoStatus ? JSON.parse(m.ultimoStatus) : null
 }))
}

async function buscarPorId(id) {
  const resultado = await db.query('SELECT id, url, apelido, ultimo_status AS "ultimoStatus" FROM monitores WHERE id = $1', [id]);
  if (!resultado.rows[0]) return null;
  return {...resultado.rows[0],
  ultimoStatus: resultado.rows[0].ultimoStatus ? JSON.parse(resultado.rows[0].ultimoStatus) : null
  }
}

async function buscarPorApelido(apelido) {
  const resultado = await db.query('SELECT id, url, apelido, ultimo_status AS "ultimoStatus" FROM monitores WHERE apelido = $1', [apelido]);
  if (!resultado.rows[0]) return null;
  return {...resultado.rows[0],
  ultimoStatus: resultado.rows[0].ultimoStatus ? JSON.parse(resultado.rows[0].ultimoStatus) : null
  }
}

async function iniciarMonitor(intervalo) {
 loopMonitor = setInterval(async () =>{
  const monitores = await db.query('SELECT * FROM monitores')
 for (let index = 0; index < monitores.rows.length; index++) {
  let api = monitores.rows[index]
  const resultado = await checkApi(api.url);
  await db.query('UPDATE monitores SET ultimo_status = $1 WHERE id = $2', [JSON.stringify(resultado), api.id])
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

async function deletarMonitor(id){
  const resultado = await db.query('DELETE FROM monitores WHERE id = $1', [id])
  return resultado.rowCount > 0;
}

export { checkApi, adicionarMonitor, iniciarMonitor,
        deletarMonitor, listarMonitores, buscarPorId,
        buscarPorApelido,pararMonitor,statusMonitor}
