// Seed script for Movie Ticket Booking Platform
// Run from server directory:
// npm run seed

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

import Movie from "../models/Movie.js";
import Theatre from "../models/Theatre.js";
import Screen from "../models/Screen.js";
import Show from "../models/Show.js";

const buildLayout = (
  rows = ["A", "B", "C", "D", "E", "F"],
  cols = 8
) => {
  return rows.map((row) =>
    Array.from({ length: cols }, (_, i) => `${row}${i + 1}`)
  );
};

const run = async () => {
  try {
    await connectDB();

    // --------------------------------------------------
    // CLEAR EXISTING DATA
    // --------------------------------------------------

    await Promise.all([
      Show.deleteMany({}),
      Screen.deleteMany({}),
      Theatre.deleteMany({}),
      Movie.deleteMany({}),
    ]);

    console.log("Existing data cleared.");

    // --------------------------------------------------
    // MOVIES
    // --------------------------------------------------

    const movies = await Movie.insertMany([ 
      {
    id: "1",
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster:
      "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg",
    genre: ["Drama", "Crime"],
    language: "English",
    duration: 142,
    releaseDate: new Date("1994-09-23"),
    rating: 8.7,
    cast: ["Tim Robbins", "Morgan Freeman"],
    director: "Frank Darabont",
    status: "NOW_SHOWING",
  },

  {
    id: "2",
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster:
      "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    genre: ["Drama", "Crime"],
    language: "English",
    duration: 175,
    releaseDate: new Date("1972-03-14"),
    rating: 8.7,
    cast: ["Marlon Brando", "Al Pacino"],
    director: "Francis Ford Coppola",
    status: "NOW_SHOWING",
  },

  {
    id: "3",
    title: "The Godfather Part II",
    description:
      "The early life and career of Vito Corleone are portrayed while his son Michael expands the family crime business.",
    poster:
      "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/kGzFbGhp99zva6oZODW5atUtnqi.jpg",
    genre: ["Drama", "Crime"],
    language: "English",
    duration: 202,
    releaseDate: new Date("1974-12-20"),
    rating: 8.6,
    cast: ["Al Pacino", "Robert De Niro"],
    director: "Francis Ford Coppola",
    status: "NOW_SHOWING",
  },

  {
    id: "4",
    title: "Schindler's List",
    description:
      "A German industrialist gradually becomes concerned for his Jewish workforce after witnessing the persecution of Jews during World War II.",
    poster:
      "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/zb6fM1CX41D9rF9hdgclu0peUmy.jpg",
    genre: ["Drama", "History", "War"],
    language: "English",
    duration: 195,
    releaseDate: new Date("1993-12-15"),
    rating: 8.6,
    cast: ["Liam Neeson", "Ben Kingsley"],
    director: "Steven Spielberg",
    status: "NOW_SHOWING",
  },

  {
    id: "5",
    title: "12 Angry Men",
    description:
      "A dissenting juror in a murder trial forces the jury to reconsider the evidence before reaching a verdict.",
    poster:
      "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/bxgTSUenZDHNFerQ1whRKplrMKF.jpg",
    genre: ["Drama"],
    language: "English",
    duration: 97,
    releaseDate: new Date("1957-04-10"),
    rating: 8.5,
    cast: ["Henry Fonda", "Lee J. Cobb"],
    director: "Sidney Lumet",
    status: "NOW_SHOWING",
  },

  {
    id: "6",
    title: "Spirited Away",
    description:
      "A young girl becomes trapped in a mysterious world of spirits and must find the courage to rescue her parents.",
    poster:
      "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/m4TUa2ciEWSlk37rOsjiSIvZDXE.jpg",
    genre: ["Animation", "Fantasy", "Adventure"],
    language: "Japanese",
    duration: 125,
    releaseDate: new Date("2001-07-20"),
    rating: 8.5,
    cast: ["Rumi Hiiragi", "Miyu Irino"],
    director: "Hayao Miyazaki",
    status: "NOW_SHOWING",
  },

  {
    id: "7",
    title: "Dilwale Dulhania Le Jayenge",
    description:
      "A young couple falls in love while traveling through Europe, but must overcome their families' traditional expectations.",
    poster:
      "https://image.tmdb.org/t/p/w500/lfRkUr7DYdHldAqi3PwdQGBRBPM.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg",
    genre: ["Drama", "Romance", "Comedy"],
    language: "Hindi",
    duration: 181,
    releaseDate: new Date("1995-10-20"),
    rating: 8.5,
    cast: ["Shah Rukh Khan", "Kajol"],
    director: "Aditya Chopra",
    status: "NOW_SHOWING",
  },

  {
    id: "8",
    title: "The Dark Knight",
    description:
      "Batman faces a criminal mastermind whose reign of chaos pushes Gotham City and its heroes to their limits.",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/x5f2uTfw0Pqc5QI4ch5AHICee2o.jpg",
    genre: ["Drama", "Action", "Crime", "Thriller"],
    language: "English",
    duration: 152,
    releaseDate: new Date("2008-07-16"),
    rating: 8.5,
    cast: ["Christian Bale", "Heath Ledger"],
    director: "Christopher Nolan",
    status: "NOW_SHOWING",
  },

  {
    id: "9",
    title: "The Green Mile",
    description:
      "A prison guard discovers that a gentle inmate possesses a mysterious supernatural gift.",
    poster:
      "https://image.tmdb.org/t/p/w500/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/vxJ08SvwomfKbpboCWynC3uqUg4.jpg",
    genre: ["Drama", "Fantasy", "Crime"],
    language: "English",
    duration: 189,
    releaseDate: new Date("1999-12-10"),
    rating: 8.5,
    cast: ["Tom Hanks", "Michael Clarke Duncan"],
    director: "Frank Darabont",
    status: "NOW_SHOWING",
  },

  {
    id: "10",
    title: "Parasite",
    description:
      "An unemployed family slowly becomes entangled with a wealthy household, leading to unexpected consequences.",
    poster:
      "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/x6skktR5OS99lAX4JhmjCQYq490.jpg",
    genre: ["Drama", "Thriller", "Comedy"],
    language: "Korean",
    duration: 132,
    releaseDate: new Date("2019-05-30"),
    rating: 8.5,
    cast: ["Song Kang-ho", "Choi Woo-shik"],
    director: "Bong Joon-ho",
    status: "NOW_SHOWING",
  },

  {
    id: "11",
    title: "Pulp Fiction",
    description:
      "Several interconnected stories of criminals, gangsters and ordinary people unfold across Los Angeles.",
    poster:
      "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    genre: ["Crime", "Thriller"],
    language: "English",
    duration: 154,
    releaseDate: new Date("1994-09-10"),
    rating: 8.5,
    cast: ["John Travolta", "Samuel L. Jackson"],
    director: "Quentin Tarantino",
    status: "NOW_SHOWING",
  },

  {
    id: "12",
    title: "Your Name",
    description:
      "Two teenagers mysteriously begin swapping bodies and must find a way to understand their strange connection.",
    poster:
      "https://image.tmdb.org/t/p/w500/vfJFJPepRKapMd5G2ro7klIRysq.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/8x9iKH8kWA0zdkgNdpAew7OstYe.jpg",
    genre: ["Animation", "Romance", "Drama"],
    language: "Japanese",
    duration: 106,
    releaseDate: new Date("2016-08-26"),
    rating: 8.5,
    cast: ["Ryunosuke Kamiki", "Mone Kamishiraishi"],
    director: "Makoto Shinkai",
    status: "NOW_SHOWING",
  },

  {
    id: "13",
    title: "The Lord of the Rings: The Return of the King",
    description:
      "The final battle against Sauron begins as the members of the Fellowship fight to save Middle-earth.",
    poster:
      "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/5JrZAtyk3LwiiAWLW0kwz41XZJC.jpg",
    genre: ["Adventure", "Fantasy", "Action"],
    language: "English",
    duration: 201,
    releaseDate: new Date("2003-12-17"),
    rating: 8.5,
    cast: ["Elijah Wood", "Viggo Mortensen"],
    director: "Peter Jackson",
    status: "NOW_SHOWING",
  },

  {
    id: "14",
    title: "Forrest Gump",
    description:
      "A simple man experiences extraordinary events throughout his life while never giving up on his childhood love.",
    poster:
      "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/mzfx54nfDPTUXZOG48u4LaEheDy.jpg",
    genre: ["Drama", "Romance"],
    language: "English",
    duration: 142,
    releaseDate: new Date("1994-06-23"),
    rating: 8.5,
    cast: ["Tom Hanks", "Robin Wright"],
    director: "Robert Zemeckis",
    status: "NOW_SHOWING",
  },

  {
    id: "15",
    title: "The Good, the Bad and the Ugly",
    description:
      "Three gunslingers compete against each other while searching for buried Confederate gold during the Civil War.",
    poster:
      "https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/x4biAVdPVCghBlsVIzB6NmbghIz.jpg",
    genre: ["Western"],
    language: "Italian",
    duration: 161,
    releaseDate: new Date("1966-12-22"),
    rating: 8.5,
    cast: ["Clint Eastwood", "Eli Wallach"],
    director: "Sergio Leone",
    status: "NOW_SHOWING",
  },

  {
    id: "16",
    title: "Seven Samurai",
    description:
      "A samurai gathers six others to protect a poor village from a group of bandits.",
    poster:
      "https://image.tmdb.org/t/p/w500/iAq0sq42vKTLneVGqHn1D4GzgrM.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/sJNNMCc6B7KZIY3LH3JMYJJNH5j.jpg",
    genre: ["Action", "Drama"],
    language: "Japanese",
    duration: 207,
    releaseDate: new Date("1954-04-26"),
    rating: 8.5,
    cast: ["Toshirō Mifune", "Takashi Shimura"],
    director: "Akira Kurosawa",
    status: "NOW_SHOWING",
  },

  {
    id: "17",
    title: "Flow",
    description:
      "A solitary cat displaced by a great flood finds refuge on a boat and learns to survive alongside other animals.",
    poster:
      "https://image.tmdb.org/t/p/w500/imKSymKBK7o73sajciEmndJoVkR.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/b3mdmjYTEL70j7nuXATUAD9qgu4.jpg",
    genre: ["Animation", "Fantasy", "Adventure"],
    language: "Latvian",
    duration: 85,
    releaseDate: new Date("2024-08-29"),
    rating: 8.5,
    cast: ["Gints Zilbalodis"],
    director: "Gints Zilbalodis",
    status: "NOW_SHOWING",
  },

  {
    id: "18",
    title: "GoodFellas",
    description:
      "The rise and fall of a young man who becomes deeply involved with the New York Mafia.",
    poster:
      "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/7TF4p86ZafnxFuNqWdhpHXFO244.jpg",
    genre: ["Drama", "Crime"],
    language: "English",
    duration: 145,
    releaseDate: new Date("1990-09-12"),
    rating: 8.5,
    cast: ["Robert De Niro", "Ray Liotta"],
    director: "Martin Scorsese",
    status: "NOW_SHOWING",
  },

  {
    id: "19",
    title: "Grave of the Fireflies",
    description:
      "Two siblings struggle to survive in Japan during the final months of World War II.",
    poster:
      "https://image.tmdb.org/t/p/w500/k9tv1rXZbOhH7eiCk378x61kNQ1.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/dlC0ed9Ugh3FzydnkBtV5lRXUu4.jpg",
    genre: ["Animation", "Drama", "War"],
    language: "Japanese",
    duration: 89,
    releaseDate: new Date("1988-04-16"),
    rating: 8.5,
    cast: ["Tsutomu Tatsumi", "Ayano Shiraishi"],
    director: "Isao Takahata",
    status: "NOW_SHOWING",
  },

  {
    id: "20",
    title: "Cinema Paradiso",
    description:
      "A filmmaker remembers his childhood friendship with a projectionist and his love for cinema.",
    poster:
      "https://image.tmdb.org/t/p/w500/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/zoVeIgKzGJzpdG6Gwnr7iOYfIMU.jpg",
    genre: ["Drama", "Romance"],
    language: "Italian",
    duration: 124,
    releaseDate: new Date("1988-11-17"),
    rating: 8.4,
    cast: ["Philippe Noiret", "Salvatore Cascio"],
    director: "Giuseppe Tornatore",
    status: "NOW_SHOWING",
  },

  {
    id: "21",
    title: "Inception",
    description:
      "A skilled thief who steals secrets through dreams is given a chance to erase his past by planting an idea in someone's mind.",
    poster:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    genre: ["Action", "Science Fiction", "Adventure"],
    language: "English",
    duration: 148,
    releaseDate: new Date("2010-07-15"),
    rating: 8.4,
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    director: "Christopher Nolan",
    status: "NOW_SHOWING",
  },

  {
    id: "22",
    title: "Interstellar",
    description:
      "A group of explorers travels through a newly discovered wormhole in search of a new home for humanity.",
    poster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/pbrkL804c8yAv3zBZR4QPEafpAR.jpg",
    genre: ["Adventure", "Drama", "Science Fiction"],
    language: "English",
    duration: 169,
    releaseDate: new Date("2014-11-05"),
    rating: 8.4,
    cast: ["Matthew McConaughey", "Anne Hathaway"],
    director: "Christopher Nolan",
    status: "NOW_SHOWING",
  },

  {
    id: "23",
    title: "The Matrix",
    description:
      "A computer hacker discovers that reality is an elaborate simulation controlled by intelligent machines.",
    poster:
      "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/oMsxZEvz9a708d49b6UdZK1KAo5.jpg",
    genre: ["Action", "Science Fiction"],
    language: "English",
    duration: 136,
    releaseDate: new Date("1999-03-30"),
    rating: 8.2,
    cast: ["Keanu Reeves", "Laurence Fishburne"],
    director: "Lana Wachowski",
    status: "NOW_SHOWING",
  },

  {
    id: "24",
    title: "Titanic",
    description:
      "A young couple from different social classes falls in love aboard the ill-fated RMS Titanic.",
    poster:
      "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/rzdPqYx7Um4FUZeD8wpXqjAUcEm.jpg",
    genre: ["Drama", "Romance"],
    language: "English",
    duration: 194,
    releaseDate: new Date("1997-11-18"),
    rating: 7.9,
    cast: ["Leonardo DiCaprio", "Kate Winslet"],
    director: "James Cameron",
    status: "NOW_SHOWING",
  },

  {
    id: "25",
    title: "Gladiator",
    description:
      "A Roman general is betrayed and forced into slavery, where he becomes a gladiator seeking revenge.",
    poster:
      "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/3ZVEtQxVPpEp5LNpAULDcxadTU3.jpg",
    genre: ["Action", "Drama", "Adventure"],
    language: "English",
    duration: 155,
    releaseDate: new Date("2000-05-04"),
    rating: 8.2,
    cast: ["Russell Crowe", "Joaquin Phoenix"],
    director: "Ridley Scott",
    status: "NOW_SHOWING",
  },

  {
    id: "26",
    title: "The Prestige",
    description:
      "Two rival magicians become obsessed with defeating each other, leading to dangerous secrets and sacrifices.",
    poster:
      "https://image.tmdb.org/t/p/w500/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/xBDE2d6HM1aBKQRu4IT7SfPD9fs.jpg",
    genre: ["Drama", "Mystery", "Science Fiction"],
    language: "English",
    duration: 130,
    releaseDate: new Date("2006-10-19"),
    rating: 8.2,
    cast: ["Christian Bale", "Hugh Jackman"],
    director: "Christopher Nolan",
    status: "NOW_SHOWING",
  },

  {
    id: "27",
    title: "Saving Private Ryan",
    description:
      "A group of soldiers is sent behind enemy lines during World War II to rescue a missing paratrooper.",
    poster:
      "https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/bdD39MpSVhKjxarTxLSfX6baoMP.jpg",
    genre: ["Drama", "War", "History"],
    language: "English",
    duration: 169,
    releaseDate: new Date("1998-07-24"),
    rating: 8.2,
    cast: ["Tom Hanks", "Matt Damon"],
    director: "Steven Spielberg",
    status: "NOW_SHOWING",
  },

  {
    id: "28",
    title: "Avengers: Endgame",
    description:
      "The remaining Avengers attempt to undo the devastating actions of Thanos and restore the universe.",
    poster:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    genre: ["Action", "Adventure", "Science Fiction"],
    language: "English",
    duration: 181,
    releaseDate: new Date("2019-04-24"),
    rating: 8.3,
    cast: ["Robert Downey Jr.", "Chris Evans"],
    director: "Anthony Russo",
    status: "NOW_SHOWING",
  },

  {
    id: "29",
    title: "Now You See Me",
    description:
      "A team of illusionists performs elaborate magic shows while secretly carrying out impossible bank heists.",
    poster:
      "https://image.tmdb.org/t/p/w500/tWsNYbrqy1p1w6K9zRk0mSchztT.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/xEY0MV2jSQBz9iOJfCFvLTiPGMA.jpg",
    genre: ["Thriller", "Crime"],
    language: "English",
    duration: 116,
    releaseDate: new Date("2013-05-29"),
    rating: 7.3,
    cast: ["Jesse Eisenberg", "Mark Ruffalo"],
    director: "Louis Leterrier",
    status: "NOW_SHOWING",
  },

  {
    id: "30",
    title: "Fight Club",
    description:
      "An insomniac office worker and a mysterious soap salesman create an underground fight club that spirals out of control.",
    poster:
      "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    genre: ["Drama", "Thriller"],
    language: "English",
    duration: 139,
    releaseDate: new Date("1999-10-15"),
    rating: 8.4,
    cast: ["Brad Pitt", "Edward Norton"],
    director: "David Fincher",
    status: "NOW_SHOWING",
  },

  {
    id: "31",
    title: "Oppenheimer",
    description:
      "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    poster:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    genre: ["Drama", "History"],
    language: "English",
    duration: 180,
    releaseDate: new Date("2023-07-19"),
    rating: 8.1,
    cast: ["Cillian Murphy", "Emily Blunt"],
    director: "Christopher Nolan",
    status: "NOW_SHOWING",
  },

  {
    id: "32",
    title: "Dune",
    description:
      "A gifted young man must travel to the most dangerous planet in the universe to protect his family and people.",
    poster:
      "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
    genre: ["Science Fiction", "Adventure", "Drama"],
    language: "English",
    duration: 155,
    releaseDate: new Date("2021-09-15"),
    rating: 8.0,
    cast: ["Timothée Chalamet", "Zendaya"],
    director: "Denis Villeneuve",
    status: "NOW_SHOWING",
  },

  {
    id: "33",
    title: "Joker",
    description:
      "A failed comedian's life takes a dark turn as he descends into a world of crime and chaos.",
    poster:
      "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/f5F4cRhQdUbyVbB5lTNCwUzD6BP.jpg",
    genre: ["Crime", "Drama", "Thriller"],
    language: "English",
    duration: 122,
    releaseDate: new Date("2019-10-04"),
    rating: 8.2,
    cast: ["Joaquin Phoenix", "Robert De Niro"],
    director: "Todd Phillips",
    status: "NOW_SHOWING",
  },

  {
    id: "34",
    title: "Spider-Man: No Way Home",
    description:
      "Peter Parker's secret identity is revealed, forcing him to seek help from Doctor Strange with dangerous consequences.",
    poster:
      "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/zD5v1E4joAzFvmAEytt7fM3ivyT.jpg",
    genre: ["Action", "Adventure", "Science Fiction"],
    language: "English",
    duration: 148,
    releaseDate: new Date("2021-12-15"),
    rating: 7.9,
    cast: ["Tom Holland", "Zendaya"],
    director: "Jon Watts",
    status: "NOW_SHOWING",
  },

  {
    id: "35",
    title: "Top Gun: Maverick",
    description:
      "Maverick trains a new generation of pilots for a dangerous mission while confronting his own past.",
    poster:
      "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg",
    genre: ["Action", "Drama"],
    language: "English",
    duration: 131,
    releaseDate: new Date("2022-05-24"),
    rating: 8.3,
    cast: ["Tom Cruise", "Miles Teller"],
    director: "Joseph Kosinski",
    status: "NOW_SHOWING",
  },

  {
    id: "36",
    title: "Iron Man",
    description:
      "After being held captive, billionaire engineer Tony Stark builds a powerful armored suit and becomes Iron Man.",
    poster:
      "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg",
    genre: ["Action", "Science Fiction", "Adventure"],
    language: "English",
    duration: 126,
    releaseDate: new Date("2008-04-30"),
    rating: 7.7,
    cast: ["Robert Downey Jr.", "Gwyneth Paltrow"],
    director: "Jon Favreau",
    status: "NOW_SHOWING",
  },

  {
    id: "37",
    title: "Black Panther",
    description:
      "T'Challa returns home to Wakanda and must defend his kingdom against a powerful challenger.",
    poster:
      "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/19Ed4XgjahPm4U8JT7SnntERIlt.jpg",
    genre: ["Action", "Adventure", "Science Fiction"],
    language: "English",
    duration: 134,
    releaseDate: new Date("2018-02-13"),
    rating: 7.4,
    cast: ["Chadwick Boseman", "Michael B. Jordan"],
    director: "Ryan Coogler",
    status: "NOW_SHOWING",
  },

  {
    id: "38",
    title: "John Wick: Chapter 4",
    description:
      "John Wick discovers a way to defeat the High Table but must face powerful new enemies across the globe.",
    poster:
      "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    genre: ["Action", "Thriller", "Crime"],
    language: "English",
    duration: 169,
    releaseDate: new Date("2023-03-22"),
    rating: 8.0,
    cast: ["Keanu Reeves", "Donnie Yen"],
    director: "Chad Stahelski",
    status: "NOW_SHOWING",
  },

  {
    id: "39",
    title: "Avatar",
    description:
      "A marine on the moon Pandora becomes torn between following his mission and protecting an alien civilization.",
    poster:
      "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/vL5LR6WdxWPjLPFRLe133jXWsh5.jpg",
    genre: ["Action", "Adventure", "Fantasy", "Science Fiction"],
    language: "English",
    duration: 162,
    releaseDate: new Date("2009-12-15"),
    rating: 7.6,
    cast: ["Sam Worthington", "Zoe Saldana"],
    director: "James Cameron",
    status: "NOW_SHOWING",
  },

  {
    id: "40",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A young hobbit begins a dangerous journey to destroy a powerful ring before it falls into the hands of its evil creator.",
    poster:
      "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    banner:
      "https://image.tmdb.org/t/p/w1280/x2RS3uTcsJJ9IfjNPcgDmukoEcQ.jpg",
    genre: ["Adventure", "Fantasy", "Action"],
    language: "English",
    duration: 179,
    releaseDate: new Date("2001-12-18"),
    rating: 8.4,
    cast: ["Elijah Wood", "Ian McKellen"],
    director: "Peter Jackson",
    status: "NOW_SHOWING",
  }
    ]);

    console.log(`Movies created: ${movies.length}`);

    // --------------------------------------------------
    // SEAT LAYOUTS
    // --------------------------------------------------

    const standardLayout = buildLayout(
      ["A", "B", "C", "D", "E", "F"],
      8
    );

    const premiumLayout = buildLayout(
      ["A", "B", "C", "D", "E", "F", "G", "H"],
      10
    );

    const largeLayout = buildLayout(
      ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      12
    );

    // --------------------------------------------------
    // THEATRES
    // --------------------------------------------------

    // Create theatres FIRST because Screen requires theatreId.

    const theatre1 = await Theatre.create({
      name: "PVR Cinemas",
      location: {
        address: "JHV Mall, Civil Lines",
        city: "Varanasi",
      },
      screens: [],
    });

    const theatre2 = await Theatre.create({
      name: "Cinépolis",
      location: {
        address: "IP Sigra Mall",
        city: "Varanasi",
      },
      screens: [],
    });

    const theatre3 = await Theatre.create({
      name: "INOX",
      location: {
        address: "Rathyatra Mall",
        city: "Varanasi",
      },
      screens: [],
    });

    const theatre4 = await Theatre.create({
      name: "Miraj Cinemas",
      location: {
        address: "Lanka Road",
        city: "Varanasi",
      },
      screens: [],
    });

    // --------------------------------------------------
    // SCREENS
    // --------------------------------------------------

    const screen1 = await Screen.create({
      name: "Audi 1 - IMAX",
      theatreId: theatre1._id,
      seatLayout: premiumLayout,
      totalSeats: premiumLayout.flat().length,
    });

    const screen2 = await Screen.create({
      name: "Audi 2 - Normal",
      theatreId: theatre1._id,
      seatLayout: standardLayout,
      totalSeats: standardLayout.flat().length,
    });

    const screen3 = await Screen.create({
      name: "Screen 1",
      theatreId: theatre2._id,
      seatLayout: largeLayout,
      totalSeats: largeLayout.flat().length,
    });

    const screen4 = await Screen.create({
      name: "Screen 2 - Premium",
      theatreId: theatre2._id,
      seatLayout: premiumLayout,
      totalSeats: premiumLayout.flat().length,
    });

    const screen5 = await Screen.create({
      name: "Screen 1",
      theatreId: theatre3._id,
      seatLayout: standardLayout,
      totalSeats: standardLayout.flat().length,
    });

    const screen6 = await Screen.create({
      name: "Screen 2",
      theatreId: theatre3._id,
      seatLayout: standardLayout,
      totalSeats: standardLayout.flat().length,
    });

    const screen7 = await Screen.create({
      name: "Screen 1",
      theatreId: theatre4._id,
      seatLayout: premiumLayout,
      totalSeats: premiumLayout.flat().length,
    });

    // --------------------------------------------------
    // LINK SCREENS TO THEATRES
    // --------------------------------------------------

    theatre1.screens = [screen1._id, screen2._id];
    theatre2.screens = [screen3._id, screen4._id];
    theatre3.screens = [screen5._id, screen6._id];
    theatre4.screens = [screen7._id];

    await Promise.all([
      theatre1.save(),
      theatre2.save(),
      theatre3.save(),
      theatre4.save(),
    ]);

    console.log("Theatres and screens created.");

    // --------------------------------------------------
    // DATES
    // --------------------------------------------------

    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date) => {
      return date.toISOString().slice(0, 10);
    };

    const dates = [
      formatDate(today),
      formatDate(tomorrow),
      formatDate(dayAfterTomorrow),
    ];

    // --------------------------------------------------
    // SHOW TIMES
    // --------------------------------------------------

    const times = [
      {
        startTime: "10:00",
        endTime: "12:50",
      },
      {
        startTime: "13:30",
        endTime: "16:20",
      },
      {
        startTime: "17:00",
        endTime: "19:50",
      },
      {
        startTime: "20:30",
        endTime: "23:20",
      },
    ];

    // --------------------------------------------------
    // SHOWS
    // --------------------------------------------------

    const shows = [];

    for (const date of dates) {
      // ================================================
      // PVR
      // ================================================

      shows.push({
        movieId: movies[0]._id,
        theatreId: theatre1._id,
        screenId: screen1._id,
        date,
        startTime: times[0].startTime,
        endTime: times[0].endTime,
        price: 350,
        bookedSeats: ["A1", "A2", "B5", "C3"],
      });

      shows.push({
        movieId: movies[1]._id,
        theatreId: theatre1._id,
        screenId: screen2._id,
        date,
        startTime: times[1].startTime,
        endTime: times[1].endTime,
        price: 220,
        bookedSeats: ["D2", "D3"],
      });

      shows.push({
        movieId: movies[3]._id,
        theatreId: theatre1._id,
        screenId: screen1._id,
        date,
        startTime: times[2].startTime,
        endTime: times[2].endTime,
        price: 300,
        bookedSeats: ["C3", "C4", "E5"],
      });

      // ================================================
      // CINEPOLIS
      // ================================================

      shows.push({
        movieId: movies[2]._id,
        theatreId: theatre2._id,
        screenId: screen3._id,
        date,
        startTime: times[0].startTime,
        endTime: times[0].endTime,
        price: 250,
        bookedSeats: [],
      });

      shows.push({
        movieId: movies[4]._id,
        theatreId: theatre2._id,
        screenId: screen4._id,
        date,
        startTime: times[3].startTime,
        endTime: times[3].endTime,
        price: 280,
        bookedSeats: ["F1", "F2", "F3"],
      });

      // ================================================
      // INOX
      // ================================================

      shows.push({
        movieId: movies[6]._id,
        theatreId: theatre3._id,
        screenId: screen5._id,
        date,
        startTime: times[0].startTime,
        endTime: "12:06",
        price: 240,
        bookedSeats: ["A3", "A4"],
      });

      shows.push({
        movieId: movies[7]._id,
        theatreId: theatre3._id,
        screenId: screen6._id,
        date,
        startTime: times[1].startTime,
        endTime: "15:28",
        price: 260,
        bookedSeats: ["B2", "B3", "C5"],
      });

      shows.push({
        movieId: movies[11]._id,
        theatreId: theatre3._id,
        screenId: screen5._id,
        date,
        startTime: times[3].startTime,
        endTime: "22:34",
        price: 300,
        bookedSeats: [],
      });

      // ================================================
      // MIRAJ
      // ================================================

      shows.push({
        movieId: movies[8]._id,
        theatreId: theatre4._id,
        screenId: screen7._id,
        date,
        startTime: times[1].startTime,
        endTime: "15:47",
        price: 320,
        bookedSeats: ["A1", "A2"],
      });

      shows.push({
        movieId: movies[10]._id,
        theatreId: theatre4._id,
        screenId: screen7._id,
        date,
        startTime: times[3].startTime,
        endTime: "22:42",
        price: 270,
        bookedSeats: ["G4", "G5", "H2"],
      });
    }

    // --------------------------------------------------
    // INSERT SHOWS
    // --------------------------------------------------

    await Show.insertMany(shows);

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    console.log("");
    console.log("========================================");
    console.log("       SEED COMPLETE SUCCESSFULLY");
    console.log("========================================");
    console.log(`Movies   : ${movies.length}`);
    console.log(`Theatres : 4`);
    console.log(`Screens  : 7`);
    console.log(`Shows    : ${shows.length}`);
    console.log(`Dates    : ${dates.length}`);
    console.log("========================================");
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);

    await mongoose.disconnect();
    process.exit(1);
  }
}; 


run();