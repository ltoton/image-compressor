const fs = require('fs')
const sharp = require('sharp')
const cliProgress = require('cli-progress')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question('Enter source folder path: ', folderPath => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log(err)
        }
    })
    originFolderPath = folderPath
    fs.mkdir(folderPath + '/compressed', { recursive: true }, (err) => {
        destinationFolderPath = folderPath + '/compressed'
        fs.readdir(originFolderPath, (err, files) => {
            if (err) {
                console.log(err)
                error = true
            }
            console.log('Starting compression for ' + files.length + ' files...')
            console.log('Current quality: 50%')
            const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
            bar.start(files.length, 1)
            files.forEach(file => {
                if (fs.lstatSync(`${originFolderPath}/${file}`).isFile()) {
                    sharp(`${originFolderPath}/${file}`).withMetadata().jpeg({ quality: 50 }).toFile(`${destinationFolderPath}/${file}`, (err, info) => {
                        if (err) {
                            console.log(err)
                            error = true
                        }
                        bar.increment()
                    })
                }
            })
        })
    })
})