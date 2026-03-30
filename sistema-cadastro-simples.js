import mysql from 'mysql2/promise';
import prompt from 'prompt-sync';
import 'dotenv/config';

//Função criada simplesmente para evitar repetição no teste do Tipo
function TestarTipo(User){
    const IdVerificar = Number(User)
    return isNaN(IdVerificar)
}

async function TesteBanco() {
    var connection;
try {
    connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBDATABASE 
    })

    console.log('Conexão com a tabela estabelecida!')
    console.log('Qual operação deseja realizar? [Deletar, cadastrar, Atualizar e Visualizar]')
    const Ação = prompt()('Digite a escolha: ')
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
        case 'cadastrar':

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
            var UsuarioEscolhido = prompt()('Digite o ID do usuario: ')

            while (TestarTipo(UsuarioEscolhido)) {
                console.log('ID incorreto, por favor digite novamente: ')
                UsuarioEscolhido = prompt()('Digite o ID do usuario: ')
                TestarTipo(UsuarioEscolhido)
            }
            
            console.log('Insira abaixo os novos dados para atualizar!')
            const NomeAtualizar = prompt()('Digite o nome: ')
            const IdadeAtualizar = prompt()('Digite a idade: ')
            const SexAtualizar = prompt()('Digite a sexualidade: ')

            await connection.query(
                `UPDATE meus_amigos
                SET nomes = ?, idades = ?, sexualidade = ?
                WHERE id = ?`, [NomeAtualizar, IdadeAtualizar, SexAtualizar, UsuarioEscolhido]
            )

            console.log('Informações atualizadas com sucesso')
            
            break
        case 'visualizar':
            const [Dados] = await connection.query(
                'SELECT * FROM meus_amigos'
            )
            console.log('Esses são os dados da tabela ', Dados)
            break;
        default:
            console.log('Comando não reconhecido! ')

            const opcao = prompt()('Deseja realizar outro comando ou encerrar o sistema?')

            console.log('Sistema Encerrado!')
            break
    } 

} catch (err) {
    if (err.code == 'ECONNREFUSED'){
        console.log('Não foi possivel estabelecer uma conexão ao banco')
    } else {
        console.log(`Esse é o codigo do erro encontrado ${err.code} e essa é a mensagem ${err.message}`)
    }
} finally {
    if (connection) await connection.end()
}
}

TesteBanco();