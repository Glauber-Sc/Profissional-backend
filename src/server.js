import app from './app'

//app.listen(3000)


// import app from './app'

// app.listen(3001)


// app.listen(3000, () => {
//     console.log("running...");
//   });


server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor Node.js está ouvindo na porta 3000');
});
