import { createStandaloneToast } from "@chakra-ui/toast";

const criarTarefa = async ({
  fork,
  dispatch,
  action,
  busca,
  textoSucesso,
  textoCarregando,
  textoErro,
}) => {
  const { toast } = createStandaloneToast();

  toast({
    title: "Carregando",
    description: textoCarregando,
    status: "loading",
    duration: 1000,
    isClosable: true,
  });
  const tarefa = fork(async (api) => {
    await api.delay(1000);
    return await busca();
  });

  const resposta = await tarefa.result;

  if (resposta.status === "ok") {
    dispatch(action(resposta.value));
    toast({
      title: "Sucesso!",
      description: textoSucesso,
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  }

  if (resposta.status === "rejected") {
    toast({
      title: "Erro",
      description: textoErro,
      status: "error",
      duration: 1000,
      isClosable: true,
    });
  }

  return resposta;
};

export default criarTarefa;
