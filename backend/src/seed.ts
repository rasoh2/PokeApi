import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Team } from './models/Team';
import { Battle } from './models/Battle';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pokeapi_db';
    await mongoose.connect(connString, { serverSelectionTimeoutMS: 2000 });
    console.log('🌱 Connected to MongoDB for Seeding...');

    // Clear existing
    await User.deleteMany({});
    await Team.deleteMany({});
    await Battle.deleteMany({});

    // Create Demo Trainer
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const demoTrainer = await User.create({
      name: 'Ash Ketchum',
      email: 'ash@pallet.com',
      passwordHash,
      trainerLevel: 10,
      avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    });

    console.log('✅ Demo Trainer created:', demoTrainer.email);

    // Create Sample Teams
    const team1 = await Team.create({
      userId: demoTrainer._id,
      name: 'Kanto Legends',
      isPublic: true,
      notes: 'Classic balanced Kanto team for competitive battles.',
      pokemons: [
        {
          pokemonId: 25,
          name: 'pikachu',
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
          types: ['electric'],
          stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
          moves: ['thunderbolt', 'quick-attack', 'iron-tail', 'volt-tackle']
        },
        {
          pokemonId: 6,
          name: 'charizard',
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
          types: ['fire', 'flying'],
          stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
          moves: ['flamethrower', 'air-slash', 'dragon-claw', 'roost']
        },
        {
          pokemonId: 9,
          name: 'blastoise',
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
          types: ['water'],
          stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 },
          moves: ['hydro-pump', 'ice-beam', 'rapid-spin', 'scald']
        }
      ]
    });

    console.log('✅ Sample Team created:', team1.name);

    // Create Sample Battle Logs
    await Battle.create([
      {
        userId: demoTrainer._id,
        playerPokemon: { id: 25, name: 'pikachu', type: 'electric' },
        rivalPokemon: { id: 130, name: 'gyarados', type: 'water' },
        winner: 'player',
        turns: 3,
        log: ['Pikachu used Thunderbolt! Super effective!', 'Gyarados used Waterfall!', 'Pikachu used Thunderbolt! Gyarados fainted!']
      },
      {
        userId: demoTrainer._id,
        playerPokemon: { id: 6, name: 'charizard', type: 'fire' },
        rivalPokemon: { id: 3, name: 'venusaur', type: 'grass' },
        winner: 'player',
        turns: 2,
        log: ['Charizard used Flamethrower! Super effective!', 'Venusaur fainted!']
      }
    ]);

    console.log('✅ Sample Battles created!');
    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
