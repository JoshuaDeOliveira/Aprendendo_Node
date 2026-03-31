import mysql from 'mysql2/promise';
import prompt from 'prompt-sync';
import 'dotenv/config';

//Função criada simplesmente para evitar repetição no teste do Tipo
function TestarTipo(User){
    const IdVerificar = Number(User)
    return isNaN(IdVerificar)
}

//Função criada para visualizar a tabela "meus_amigos" do banco
async function VisualizarBanco(Banco){
    const [Dados] = await Banco.query(
        'SELECT * FROM meus_amigos'
    )
    return Dados
}

//Função criada para deletar Dados
async function DeletarDados(Banco, ID){
    const [VerificacaoResposta] = await Banco.query(
         `SELECT * FROM meus_amigos WHERE id = ?`, [ID]
    )

    if (VerificacaoResposta.length > 0) {
        await Banco.query(
         `DELETE FROM meus_amigos WHERE id = ?`, [ID]
    )
        console.log('Usuario Deletado com sucesso')
    } else {
        console.log('Usuario não localizado no banco de dados')
    }
}

function ValidarId(UsuarioEscolhido){
    while (TestarTipo(UsuarioEscolhido)) {
        UsuarioEscolhido = prompt()('Digite o ID do usuario: ')
        TestarTipo(UsuarioEscolhido)
    }
}

async function TesteBanco() {
    console.clear()

    var connection;
try {
    connection = await mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBDATABASE 
    })

    console.log('Conexão com o banco estabelecida!')
    console.log('Tabela de amigos escolhida...!')
    console.log('Qual operação deseja realizar? [Deletar, cadastrar, Atualizar e Visualizar]')
    const Ação = prompt()('Digite a escolha: ')
    const Escolha = Ação.toLowerCase()

    switch (Escolha) {
        case 'deletar':
            const IdUser = prompt()('Digite o id do usuario a ser deletado: ')
            DeletarDados(connection, IdUser)
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
        case 'atualizar': //Corrigir problema na feature de atualização (Nota para mim mesmo dia 30/03 para dia 31/03)
            var UsuarioEscolhido = prompt()('Digite o ID do usuario cadastrado: ')
            var UsuarioExistente;

            ValidarId(UsuarioEscolhido)

            UsuarioExistente = await connection.query(
                `SELECT * FROM meus_amigos WHERE id = ?`, [UsuarioEscolhido]
            )

            if (UsuarioExistente.length == 0) {
                console.log('Usuario não encontrado')
                console.log('Gostaria de Visualizar os usuarios cadastrados? [S/N]')
                const opção = prompt()('').toLowerCase()
                while(opção != 's' && opção != 'n'){
                    console.log('Comando não reconhecido! Por favor, insira [S] para visualizar tabela ou [N] para tentar novamente')
                    opção = prompt()('').toLowerCase()
                }

                if (opção == 's') {
                    const users = await VisualizarBanco(connection)
                    console.log(users)
                }

                while (UsuarioExistente.length == 0) {
                    UsuarioEscolhido = prompt()('Digite o ID do usuario cadastrado: ')
                    ValidarId(UsuarioEscolhido)
                    UsuarioExistente = await connection.query(
                        `SELECT * FROM meus_amigos WHERE id = ?`, [UsuarioEscolhido]
                    )
                }
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
            const Dados = await VisualizarBanco(connection)
            console.log('Esses são os dados da tabela ', Dados)
            break;
        default:
            console.log('Comando não reconhecido! ')
            console.log('Deseja realizar outro comando? [S/N]')

            var opcao = prompt()('').toLowerCase()

            while(opcao != 's' && opcao != 'n'){
                console.log('Comando não reconhecido! Por favor, insira [S] para executar outro comando ou [N] para sair do sistema')
                opcao = prompt()('').toLowerCase()
            }

            if (opcao == 's') {
                console.clear()
                TesteBanco()
            } else {
                console.log('Sistema Encerrado!')
                break
            }
    } 

    console.log('Gostaria de Executar outra ação? [S/N]')
    const simnao = prompt()('').toLowerCase()

    while(simnao != 's' && simnao != 'n'){
        console.log('Comando não reconhecido! Por favor, insira [S] para executar outra ação ou [N] para sair do sistema')
        simnao = prompt()('').toLowerCase()
    }

    if (simnao == 'n') {
        console.log('Muito obrigado por acessar nosso banco de dados!')
    } else {
        TesteBanco()
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