import { createListenerMiddleware } from "@reduxjs/toolkit";
import { carregarCategoria } from "store/reducers/categorias";
import criarTarefa from "./utils/criarTarefa";
import itensService from "services/itens";
import { adicionarItens } from "store/reducers/itens";

export const itensListener = createListenerMiddleware();

itensListener.startListening({
  actionCreator: carregarCategoria,
  effect: async (action, { dispatch, fork, unsubscribe, getState }) => {
    const nomeCategoria = action.payload;

    const { itens } = getState();
    if (itens.length === 25) unsubscribe();

    const itensCarregados = itens.some(
      (item) => item.categoria === nomeCategoria
    );

    if (itensCarregados) return;

    await criarTarefa({
      fork,
      dispatch,
      action: adicionarItens,
      busca: () => itensService.buscarPorCategoria(nomeCategoria),
      textoSucesso: `Itens da categoria ${nomeCategoria} carregadas com sucesso!`,
      textoCarregando: `Carregando itens da categoria ${nomeCategoria}`,
      textoErro: "Erro na busca de itens",
    });
  },
});
