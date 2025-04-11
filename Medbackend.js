const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/medicationsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log('MongoDB Connected'))
.catch((err)=> console.error(err));

const medication = new mongoose.Schema({
name: String, dosage: String, time: String
})
const Medication = mongoose.model('Medication',medication)
app.get('/medications', async (req, res) => {
    const meds = await Medication.find();
    res.json(meds);
  });

  app.post('/medications', async (req, res) => {
    const { name, dosage, time } = req.body;
    const newMed = new Medication({ name, dosage, time });
    await newMed.save();
    res.json(newMed);
  });

  app.delete('/medications/:id', async (req, res) => {
    await Medication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  });

  app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));