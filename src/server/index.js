const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

/**
 * for initializing server
 */
const initialize = async () => {
  try {
    const mainDB = await db.initializeMainDB();
    return mainDB;
  } catch (error) {
    return (error);
  }
};

initialize().then().catch((error) => {
  console.error('initialize error', error);
});

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.raw({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.use('/', require('./routes'));

// error handler
app.use((err, req, res, next) => {
  console.trace('END err', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(8080, () => console.log('Listening on port 8080!'));
