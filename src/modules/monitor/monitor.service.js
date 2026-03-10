import axios from "axios";

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
        Status: "online",
        Tempo_De_Resposta: tempoResposta + "ms",
        codigo_http:api.status,
        verificado_em:new Date().toLocaleString("pt-BR", {
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
      Status: "offline",
      Tempo_De_Resposta: tempoError + "ms",
      motivo: mensError,
      verificado_em:new Date().toLocaleString("pt-BR", {
  dateStyle: "short",
  timeStyle: "medium"
}),
    };
    return dados;
  }
}
