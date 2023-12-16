const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const data = require("./db/food_data.json").data;

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send("1");
});

app.get('/data', (req, res) => {
    const { age, code, diet } = req.query;

    // Check if all three parameters are provided
    if (!age || !code || !diet) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    let age_range;

    if (age < 6) {
        age_range = "infants";        
    }

    if (6 < age < 12) {
        age_range = "children";
    }
        
    if (13 < age < 17) {
        age_range = "adolescents";
    }
    
    if (18 < age < 65) {
        age_range = "adults";
    }

    if (age > 65) {
        age_range = "old_adults";
    }
    try {
        const food = data[age_range][code][diet];
        res.status(200).json({
            dish: food[0],
            calorie: food[1]
        });
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
