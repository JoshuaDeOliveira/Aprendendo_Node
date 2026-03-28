import mysql from 'mysql2/promise';
import prompt from 'prompt-sync';
import 'dotenv/config';


async function TesteBanco() {
    var connection;
try {
    connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBDATABASE 
    })
    
    const Ação = prompt()('O que gostaria de fazer na tabela de amigos? (INSERIR, DELETAR, ATUALIZAR OU APENAS VISUALIZAR) ')
    const Escolha = Ação.toLowerCase()

    switch (Escolha) {
        case 'deletar':
            const NomeUser = prompt()('Digite o nome do usuario a ser deletado: ')

            const [VerificacaoResposta] = await connection.query(
                `SELECT * FROM meus_amigos WHERE nomes = ?`, [NomeUser]
            )

            if (VerificacaoResposta.length > 0) {
                await connection.query(
                    `DELETE FROM meus_amigos WHERE nomes = ?`, [NomeUser]
                )
                console.log('Usuario Deletado com sucesso')
            } else {
                console.log('Usuario não localizado no banco de dados')
            }
            break;
        case 'inserir':

            const Nome = prompt()('Digite o seu nome: ')
            const idade = prompt()('Digite a sua idade: ')
            const sexualidade = prompt()('Digite a sua sexualidade: ')
            await connection.query(
                `INSERT INTO meus_amigos (nomes, idades, sexualidade)
                VALUES (?, ?, ?)`, [Nome, idade, sexualidade]
            );
    
            console.log('Dados foram inseridos com sucesso!')

            const [Respostas] = await connection.query(
                'SELECT * FROM meus_amigos'
            )

            console.log(`esses dados foram inseridos`, Respostas)

            break;

        case 'atualizar':
            break;
        case 'visualizar':
            const [Dados] = await connection.query(
                'SELECT * FROM meus_amigos'
            )
            console.log('Esses são os dados da tabela ', Dados)
            break;
        default:
            console.log('Comando incorreto, digite novamente')
            break;
    } 

} catch (err) {
    if (err.massage == 'ECONNREFUSED'){
        console.log('Não foi possivel estabelecer uma conexão ao banco')
    } else {
        console.log(`Esse é o codigo do erro encontrado ${err.code} e essa é a mensagem ${err.message}`)
    }
} finally {
    if (connection) await connection.end()
}
}

TesteBanco();