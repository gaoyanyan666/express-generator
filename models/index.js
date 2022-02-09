const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Campsite = require('./models/campsite');
const Promotion = require('./models/promotions');
const Partner = require('./models/partners');


const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useMongoClient: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => {

    console.log('Connected correctly to server');
//connect Campsite model with mongoDB
Campsite.create({
    name: 'React Lake Campground',
    description: 'test'
})
.then(campsite => {
    console.log(campsite);

    return Campsite.findByIdAndUpdate(campsite._id, {
        $set: { description: 'Updated Test Document' }
    }, {
        new: true
    });
})
.then(campsite => {
    console.log(campsite);

    campsite.comments.push({
        rating: 5,
        text: 'What a magnificent view!',
        author: 'Tinus Lorvaldes'
    });

    return campsite.save();
})
.then(campsite => {
    console.log(campsite);
    return Campsite.deleteMany();
})
.then(() => {
    return mongoose.connection.close();
})
.catch(err => {
    console.log(err);
    mongoose.connection.close();
});
});

//connect Partner model with mongoDB
Partner.create({
    name: "Mongo Fly Shop",
    description: "Need a new fishing pole, a tacklebox, or flies of all kinds? Stop by Mongo Fly Shop."
})
.then(partner => {
    console.log(partner);
    return Partner.findByIdAndUpdate(partner._id, {
        $set: { description: 'Updated partner Document' }
    }, {
        new: true
    });
})
.then(partner => {
    console.log(partner);
    return Partner.find();
})
.then(partner => {
    console.log(partner);
    return Partner.deleteMany();
})
.then(() => {
    return mongoose.connection.close();
})
.catch(err => {
    console.log(err);
    mongoose.connection.close();
});

//connect Promotion model with mongoDB
Promotion.create({
    name: "Mountain Adventure",
    description: "Book a 5-day mountain trek with a seasoned outdoor guide! Fly fishing equipment and lessons provided."
})
.then(promotion => {
    console.log(promotion);
    return Promotion.findByIdAndUpdate(promotion._id, {
        $set: { description: 'Updated promotion Document' }
    }, {
        new: true
    });
})
.then(promotion => {
    console.log(promotion);
    return Promotion.find();
})
.then(promotion => {
    console.log(promotion);
    return Promotion.deleteMany();
})
.then(() => {
    return mongoose.connection.close();
})
.catch(err => {
    console.log(err);
    mongoose.connection.close();
});

