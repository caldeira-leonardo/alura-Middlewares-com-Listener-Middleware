import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  adicionarCategoria,
  adicionarTodasAsCategorias,
  carregarCategoria,
  carregarCategorias,
} from "store/reducers/categorias";
import criarTarefa from "./utils/criarTarefa";
import categoriasService from "services/categorias";

export const categoriaListener = createListenerMiddleware();

categoriaListener.startListening({
  actionCreator: carregarCategorias,
  effect: async (_, { dispatch, fork, unsubscribe }) => {
    const resp = await criarTarefa({
      fork,
      dispatch,
      action: adicionarTodasAsCategorias,
      busca: categoriasService.buscar,
      textoSucesso: "Categorias carregadas com sucesso!",
      textoCarregando: "Carregando categorias",
      textoErro: "Erro na busca de categorias",
    });

    if (resp.status === "ok") unsubscribe();
  },
});

categoriaListener.startListening({
  actionCreator: carregarCategoria,
  effect: async (action, { dispatch, fork, getState, unsubscribe }) => {
    const nomeCategoria = action.payload;
    const { categorias } = getState();

    const categoriaCarregada = categorias.some(
      (categoria) => categoria.id === nomeCategoria
    );

    if (categoriaCarregada) return;
    if (categorias.length === 5) unsubscribe();

    await criarTarefa({
      fork,
      dispatch,
      action: adicionarCategoria,
      busca: () => categoriasService.buscarCategoria(nomeCategoria),
      textoSucesso: `Categoria '${nomeCategoria}' carregada com sucesso! `,
      textoCarregando: `Carregando categoria ${nomeCategoria}`,
      textoErro: "Erro na busca de categoria",
    });
  },
});
