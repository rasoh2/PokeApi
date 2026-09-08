import 'dotenv/config';
import { MongoClient } from 'mongodb';

// Lee desde process.env.MONGO_URI o process.env.MONGODB_URI o usa el valor por defecto
const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://sebastianortegaauriol_db_user:eU1G9mPtmlTVqm5T@cluster0.qtvrsap.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

async function probarConexion() {
  try {
    // 1. Nos conectamos al clúster
    await client.connect();
    console.log("¡Conexión exitosa a MongoDB Atlas!");

    // 2. Seleccionamos la base de datos y la colección
    const database = client.db('pokedex'); 
    const collection = database.collection('pokemones');

    // 3. Creamos el objeto a guardar
    const nuevoPokemon = { 
        nombre: "Bulbasaur", 
        tipo: ["Planta", "Veneno"],
        nivel: 5
    };

    // 4. Insertamos el dato
    const resultado = await collection.insertOne(nuevoPokemon);
    console.log(`¡Pokémon guardado exitosamente! ID generado automáticamente: ${resultado.insertedId}`);

  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  } finally {
    // Cerramos la conexión al terminar
    await client.close();
  }
}

probarConexion();
