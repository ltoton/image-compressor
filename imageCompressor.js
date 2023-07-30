const fs = require('fs')
const sharp = require('sharp')
const cliProgress = require('cli-progress')
const yargs = require('yargs')(process.argv.slice(2))
    .option({
        folder: {
            alias: 'f',
            describe: 'Path to the folder',
            demandOption: true,
            type: 'string'
        },
        path: {
            alias: 'p',
            describe: 'Path of the outputed files. Defaults to a subdirectory inside the current folder',
            type: 'string',
        },
        output: {
            alias: 'o',
            describe: 'Type of the file output',
            type: 'string',
            default: 'jpeg',
            choices: ['jpeg', 'webp', 'png']
        },
        quality: {
            alias: 'q',
            describe: 'Quality of the converted pictures',
            type: 'number',
            default: 70
        }
    })
    .argv

fs.readdir(yargs.folder, (err, files) => {
    if (err) {
        console.log(err)
        return
    }
})
let destinationPath = (typeof yargs.path === 'undefined') ? yargs.folder + '/compressed' : yargs.path
fs.mkdir(destinationPath, { recursive: true }, (err) => {
    fs.readdir(yargs.folder, (err, files) => {
        if (err) {
            console.log(err)
            return
        }
        console.log('Starting compression for ' + files.length + ' files')
        console.log('Output type: ' + yargs.output)
        console.log('Quality: ' + yargs.quality)
        console.log('Output folder: ' + destinationPath)
        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
        bar.start(files.length, 1)
        files.forEach(file => {
            if (fs.lstatSync(`${yargs.folder}/${file}`).isFile()) {
                const options = {quality: yargs.quality}    
                let sharpObj = sharp(`${yargs.folder}/${file}`).withMetadata()
                let extension
                switch (yargs.output) {
                    case 'jpeg':
                        sharpObj.jpeg(options)
                        extension = 'jpg'
                        break
                    case 'webp':
                        sharpObj.webp(options)
                        extension = 'webp'
                        break
                    case 'png':
                        sharpObj.png(options)
                        extension = 'png'
                        break
                }
                sharpObj
                .toFile(`${destinationPath}/${file.split('.')[0]}.${extension}`, (err, info) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    bar.increment()
                })
            }
        })
    })
})