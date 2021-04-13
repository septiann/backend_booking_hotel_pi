var seeder = require('mongoose-seed')
var mongoose = require('mongoose')

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://127.0.0.1:27017/db_inncation', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}, function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/Category',
    './models/Bank',
    './models/Item',
    './models/Feature',
    './models/Activity',
    './models/Member',
    './models/Image',
    './models/Member',
    './models/Booking',
    './models/User'
  ]);

  // Clear specified collections
  seeder.clearModels(['Category', 'Bank', 'Item', 'Member', 'Item', 'Feature', 'Image', 'Booking', 'User'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
  {
    'model': 'Member',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903333'),
        firstName: 'Septian',
        lastName: 'Nugraha',
        email: 'septiann@outlook.com',
        phoneNumber: '081234567890'
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903334'),
        firstName: 'Kai',
        lastName: 'Havertz',
        email: 'kaihavertz@gmail.com',
        phoneNumber: '081234567890'
      }
    ]
  },
  {
    'model': 'User',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
        username: 'admin',
        password: 'rahasia',
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903346'),
        username: 'superadmin',
        password: 'rahasia',
        role: 'admin'
      },
    ]
  }
];