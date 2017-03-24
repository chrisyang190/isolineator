const Translate = require('@google-cloud/translate')({
	projectId: 'isolineator-162122',
	keyFilename: './APIs/Isolineator-51a1a3f4914b.json'
})


exports.Translater = function(text, target, callback) {
	Translate.translate(text, target).then((results) => {
    // console.log(results[0])
    callback(results[0]);
  }).catch((error) => {
  		console.log(error);
  })
};


























//*******************This was original code used to call API*********************



// var exampleData = ['All work and no play makes Jack a dull boy'];

// var format = exampleData[0].split(' ').reduce(function(acc, value) {
// 	return acc + value + '%20';
// }, 'https://translation.googleapis.com/language/translate/v2?key=AIzaSyCciuiJZRV2VU7NSbm_Tjv4mboAEID-D3w&source=en&target=es&q=')

// var url = format.slice(0, -3);

// var options = {
// 	'Content-Type': 'plain/text',
// 	'url': url
// }

// var Translate = request(options, function (error, response, body) {
// 	if (error) {
// 		console.log(error);
// 	}

//   if (!error && response.statusCode === 200) {
//     console.log(body)
//   } 
// });

// module.exports.Translate = Translate;