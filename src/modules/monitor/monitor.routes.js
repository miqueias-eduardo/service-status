import express from 'express'
import * as monitor from './monitor.service.js';

const router = express.Router();

router.post('/', (req,res)=>{
 try{
    const{url,apelido}= req.body

     if (!url || !apelido || typeof url !== "string" || typeof apelido !== "string") {
      return res.status(400).json({
        erro: "url e apelido devem ser textos válidos"
      });
    }

    if (url.trim() === "" || apelido.trim() === "") {
      return res.status(400).json({
        erro: "Campos não podem estar vazios"
      });
    }

    monitor.adicionarMonitor(url,apelido)
    res.status(201).json({mensagem:'Monitor adicionado com sucesso'})
}
catch(error){
   if (error.statusCode) {
    return res.status(error.statusCode).json({
      erro: error.message
    });
  }
 console.log('Erro ao adicionar Monitor',error)
 res.status(500).send('Erro no servidor')
}
})

router.get('/',(req,res)=>{
    try{
    const monitores = monitor.listarMonitores();
    res.status(200).json({mensagem:'monitores listados',
                          dados:monitores })
    }
    catch(error){
     console.log('Erro ao listar Monitores',error)
     res.status(500).send('Erro no servidor')
    }
})

router.get('/id/:id',(req,res)=>{
   try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ erro: "ID é obrigatório" });
    }

    const monitorEncontrado = monitor.buscarPorId(id);

    if (!monitorEncontrado) {
      return res.status(404).json({
        erro: "Monitor não encontrado"
      });
    }

    return res.status(200).json(monitorEncontrado);

  } catch (error) {
    console.log('Erro ao buscar Monitor', error);
    return res.status(500).send('Erro no servidor');
  }
});

router.get('/apelido/:apelido',(req,res)=>{
try {
    const { apelido } = req.params;

    if (!apelido) {
      return res.status(400).json({ erro: "Apelido é obrigatório" });
    }

    const monitorEncontrado = monitor.buscarPorApelido(apelido);

    if (!monitorEncontrado) {
      return res.status(404).json({
        erro: "Monitor não encontrado"
      });
    }

    return res.status(200).json(monitorEncontrado);

  } catch (error) {
    console.log('Erro ao buscar Monitor', error);
    return res.status(500).send('Erro no servidor');
  }
})

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ erro: "ID é obrigatório" });
    }

    const removido = monitor.deletarMonitor(id);

    if (!removido) {
      return res.status(404).json({
        erro: "Monitor não encontrado"
      });
    }

    return res.status(200).json({
      mensagem: "Monitor removido com sucesso"
    });

  } catch (error) {
    console.log('Erro ao deletar Monitor', error);
    res.status(500).send('Erro no servidor');
  }
});

router.post('/iniciar', (req,res)=>{
try{
  const {intervaloMinutos} = req.body || {};

  if(!intervaloMinutos || typeof intervaloMinutos !=='number' ||intervaloMinutos< 5){
    return res.status(400).json({erro: "o intervalo deve ser um numero de no mínimo 5 minutos"})
  }
  const intervaloMs = intervaloMinutos * 60 * 1000;
  monitor.iniciarMonitor(intervaloMs)

  return res.status(200).json({
    mensagem:"Monitor iniciado com sucesso"
  })
}
catch (error) {
      console.log('Erro ao Iniciar Monitor', error);
    res.status(500).send('Erro no servidor');
}
})

router.post('/parar', (req,res)=>{
  try{
    const parar = monitor.pararMonitor();
    res.status(200).json({mensagem:"Monitor parado com sucesso"})
  }
  catch(error){
       console.log('Erro ao Parar Monitor', error);
    res.status(500).send('Erro no servidor');
  }
})

router.get('/status', (req,res)=>{
  try {
    const status = monitor.statusMonitor();
    res.status(200).json({ ativo: status })
  } catch (error) {
         console.log('Erro ao retornar Status do Monitor', error);
    res.status(500).send('Erro no servidor');
  }
})
export default router;
