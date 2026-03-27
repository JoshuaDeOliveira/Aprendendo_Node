import mysql from 'mysql2/promise';
import prompt from 'prompt-sync';
import 'dotenv/config';

async function TesteBanco() {
    const connection = await mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
})

try {
    const Nome = prompt()('Digite o seu nome: ')
    const idade = prompt()('Digite a sua idade: ')
    const sexualidade = prompt()('Digite a sua sexualidade: ')
    await connection.query(
        `INSERT INTO meus_amigos (nomes, idades, sexualidade)
        VALUES ('${Nome}', '${idade}', '${sexualidade}')`
    );
    console.log('Dados foram inseridos com sucesso!')

    const [Respostas] = await connection.query(
        'SELECT * FROM meus_amigos'
    )
    console.log(`esses dados foram inseridos`, Respostas)
} catch (ErroBanco) {
    console.log(`${ErroBanco} - foi isso que aconteceu na hora de inserir os dados`)
} finally {
    await connection.end();
} 

/*try{
    const [Respostas] = await connection.query(
        'SELECT * FROM meus_amigos'
    );
    console.log(Respostas)
    console.log('Funcionou!')
} catch (ErroBanco) {
    console.log(`${ErroBanco} - foi essa merda que aconteceu`)
} finally {
    await connection.end();
}*/

}

TesteBanco();