var prettySwag = require('pretty-swag');

var colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey', 'black', 'white'];

for (var i = 0; i< colors.length;i++) {
    var starter = `{"input":"c:\\\\tmp\\\\pet.json","format":"lite","markdown":true,"theme":"blue","fixedNav":true,"output":"c:\\\\tmp\\\\pet.html","autoTags":true,"noDate":false,"noCredit":false,"noNav":false,"noRequest":false,"indent_num":3,"collapse":{"path":false,"method":false,"tool":true}}`;
    var config = JSON.parse(starter);
    var color = colors[i];
    config.theme = color;
    config.output = "c:\\tmp\\pet-"+color+".html";
    prettySwag.run(config.input, config.output, config, function (err, msg) {

        // console.log(color);
        if (err) {
            console.log("Error: " + err);
            process.exit(1);
        }
        console.log("DONE");
    });

}
