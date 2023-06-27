const { model } = require('mongoose');
const Park = require('../models/park');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    const parks = await Park.find({});
    res.render('parks/index', { parks });
}

module.exports.renderNewForm = (req, res) => {
  res.render('parks/new');
}

module.exports.createPark = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.park.location,
    limit: 1
  }).send();
  const park = new Park(req.body.park);
  park.geometry = geoData.body.features[0].geometry;
  park.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  park.author = req.user._id;
  await park.save();
  req.flash('success', 'Successfully created new park!')
  res.redirect(`/parks/${park._id}`);
}

module.exports.showPark = async (req, res, next) => {
  const park = await Park.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!park) {
    req.flash('error', 'Cannot find that park!');
    return res.redirect('/parks');
  }
  res.render('parks/show', { park });
}

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const park = await Park.findById(id);
  if (!park) {
    req.flash('error', 'Cannot find that park!');
    return res.redirect('/parks');
  }
    res.render('parks/edit', { park });
}

module.exports.updatePark = async (req, res, next) => {
  const { id } = req.params;  
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  park.images.push(...imgs);  
  await park.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await park.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Successfully updated park!');
  res.redirect(`/parks/${park._id}`);
}

module.exports.deletePark = async (req, res, next) => {
    const { id } = req.params;
  await Park.findByIdAndDelete(id);
  req.flash('success', 'Park Deleted!');
    res.redirect('/parks');
}