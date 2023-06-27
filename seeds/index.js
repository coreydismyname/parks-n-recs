const mongoose = require('mongoose');
const cities = require('./cities');
const { things, descriptors } = require('./seedHelpers');
const Park = require('../models/park');

mongoose.connect('mongodb://127.0.0.1:27017/parks-n-recs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Park.deleteMany({});
  for (let i = 0; i < 250; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const park = new Park({
      //Your User ID
      author: '6491db7cdeac04c399e0056d',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      title: `${sample(descriptors)} ${sample(things)}`,
      description: 'Velit sed ullamcorper morbi tincidunt. Nunc eget lorem dolor sed viverra ipsum nunc. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Viverra aliquet eget sit amet. Fringilla urna porttitor rhoncus dolor purus non enim.',
      images: [
    {
      url: 'https://res.cloudinary.com/dsjmpyrls/image/upload/v1687471094/Park%20n%20Recs/iww7arqlj9fyzha5ze1f.jpg',
      filename: 'Park n Recs/iww7arqlj9fyzha5ze1f'
    },
    {
      url: 'https://res.cloudinary.com/dsjmpyrls/image/upload/v1687471096/Park%20n%20Recs/c7elgpe1egeiuvhmntsv.jpg',
      filename: 'Park n Recs/c7elgpe1egeiuvhmntsv'
    }
  ]

    })
    await park.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});