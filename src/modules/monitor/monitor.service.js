import axios from "axios";

async function checkApi(url) {
  const hora = Date.now();
  let tempoApi = 0;
  try {
    const api = await axios.get(url, {
      timeout: 10000,
    });
    tempoApi = Date.now() - hora;
    if (api) {
      const dados = {
        Status: "online",
        Tempo_De_Resposta: tempoApi + "ms",
      };
      return console.log(dados);
    }
  }
  catch (error) {
    let mensError = "";
    const tempoError = Date.now() - hora;
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
    };
    return console.log(dados);
  }
}
