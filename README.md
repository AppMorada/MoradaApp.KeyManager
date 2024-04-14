# Key Manager Group function
Este é um grupo básico designado para a gestão de chaves de assinaturas dinâmicas em tokens ou credenciais de estado crítico. Para fazer o uso desta aplicação em produção acesse a documentação no Postman, defina as variáveis requisitadas e solicite a permissão de acesso dos administradores da infraestrutura! 

## Uso local
Para utilizar a aplicação localmente basta clonar o repositório e seguir os seguintes passos:

```
pnpm install && pnpm dev
```

Logo após isso, as functions serão habilitadas para uso local e você estará apto a testar em sua máquina.

## Uso via docker images
As docker images deste projeto possuem todas as três functions armazenadas internamente, ou seja, você pode escolher qual delas usar com base no package.jso, observer um docker-compose.yml de exemplo:

```
  createKeyFunc:
     image: moradaapp/key-manager:latest
     restart: always
     hostname: createkeyfunc
     command: pnpm functions:createkeyfnc
     environment: 
       GCP_PROJECT: <link do projeto>
       FIRESTORE_EMULATOR_HOST: app:8081
     ports:
       - 8411:8411
   
   deleteKeyFunc:
     image: moradaapp/key-manager:latest
     env_file: .env
     restart: always
     hostname: deletekeyfunc
     command: pnpm functions:deletekeyfnc
     environment:
       GCP_PROJECT: <link do projeto>
       FIRESTORE_EMULATOR_HOST: app:8081
     ports:
       - 8412:8412
  
   updateKeyFunc:
     image: moradaapp/key-manager:latest
     env_file: .env
     restart: always
     hostname: updatekeyfunc
     command: pnpm functions:updatekeyfnc
     environment:
       GCP_PROJECT: <link do projeto>
       FIRESTORE_EMULATOR_HOST: app:8081
     ports:
       - 8413:8413
``````

Ao executar este exemplo dentro de um docker compose, as três functions serão inicializadas em ambiente de desenvolvimento e suas URLs serão reportadas no terminal.

## Documentação
Você pode conferir a documentação do projeto no diretório /swagger, executando ```pnpm install && pnpm start:docs``` dentro da pasta.
