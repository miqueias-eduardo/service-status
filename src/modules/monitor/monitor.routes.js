import express from 'express'
import * as monitor from './monitor.service.js';

const router = express.Router();

router.post('/monitor', (req,res)=>{
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
 console.log('Erro ao adicionar Monitor',error)
 res.status(500).send('Erro no servidor')
}
})

router.get('/monitor',(req,res)=>{
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

router.delete('/monitor/:id', (req, res) => {
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

export default router;
