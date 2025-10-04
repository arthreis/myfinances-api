import { dataSource } from './src/shared/infra/typeorm/config/datasources/ormconfig';

const teardown = async () => {
  console.log('Iniciando o processo de teardown do Jest...');
  if (dataSource.isInitialized) {
    console.log('Fechando a conexão do banco de dados após todos os testes...');
    await dataSource.destroy();
    console.log('Conexão fechada com sucesso. Jest pode sair.');
  } else {
    console.log('A conexão do banco de dados já estava fechada.');
  }
};

export default teardown;
