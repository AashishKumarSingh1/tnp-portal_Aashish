const mysql = require('mysql2/promise')
const fs = require('fs').promises
require('dotenv').config()

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'tnp_portal'
}

async function fetchAndSaveTableDefinitions() {
  let connection
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    })

    // Fetch all table names
    const [tables] = await connection.query('SHOW TABLES')
    const tableKey = `Tables_in_${dbConfig.database}`
    let output = `Database: ${dbConfig.database}\n\n`

    for (const row of tables) {
      const tableName = row[tableKey]
      output += `Table: ${tableName}\n`
      // Fetch table description
      const [descRows] = await connection.query(`DESC \`${tableName}\``)
      // Format the description
      output += 'Field\tType\tNull\tKey\tDefault\tExtra\n'
      for (const desc of descRows) {
        output += `${desc.Field}\t${desc.Type}\t${desc.Null}\t${desc.Key}\t${desc.Default === null ? 'NULL' : desc.Default}\t${desc.Extra}\n`
      }
      output += '\n'
    }

    // Write to file
    await fs.writeFile('table_def.txt', output, 'utf8')
    console.log('Table definitions saved to table_def.txt')
    await connection.end()
  } catch (error) {
    if (connection) await connection.end()
    console.error('Error fetching table definitions:', error)
    process.exit(1)
  }
}

fetchAndSaveTableDefinitions()