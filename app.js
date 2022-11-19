const express = require('express');
const app = express();
const videoRouter = require('./route/video')
const PORT = process.env.PORT || 4000;
let path       = require('path');
// app.get('/', (req, res, next) =>{
//     res.send("Hello");
// })

// app.use('/video', videoRouter)
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use('/test', require('./route/index'));
app.use('/video', require('./route/video'));
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

// module.exports=app;