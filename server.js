const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      { spawn } = require('child_process');

const models = ['haiku', 'shakespeare', 'eminem'];

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const generateOptions = ({style, temp, word, poems_counts}) => {

  const options = ['-m', `${models[style]}.p`, '-t', temp, '-n', poems_counts];

  if(word.length > 0) {
    options.push('-s', word);
  }
  return options
};

app.post('/lyrics', (req, res) => {

  const options = generateOptions(req.body);
  
  const model = spawn('python', ['./dl-model/sample.py', ...options]) 
  model.stdout.on('data', (data) => {
    console.log(data.toString());
    const verses = data.toString().split('\n').splice(9, 10000000).map(poem => poem.split('\n'));
    res.send(JSON.stringify(verses));
  });
});

app.listen(8080, () => console.log('Server listening on port 8080.'));
