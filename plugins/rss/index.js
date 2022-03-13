const PathUtils = require('path')
const fs = require('fs/promises')
const AppConfig = require('../../config')

const RelativeRootPath = '../../'
const RootPath = PathUtils.resolve(__dirname, RelativeRootPath)

const ArgTable = {
    '-i': 'The output of files-list which will input.',
    '-o': 'The dir where output to.',
    '--max': 'The max number of output post.',
    '--url': 'The url of your website.',
    '--baseUrl': 'The base url which your docs are routed.',
    '--title': 'The title of your website.',
    '--description': 'The description of your website.',
    '--creator': 'The creator of this website'
}

const argsStr = process.argv.slice(2)
const args = {}

for (let i = 0; i < argsStr.length; i+=2) {
    if (argsStr[i] === '-h') {
        console.log(ArgTable)
        process.exit(0)
    }
    if (argsStr[i] in ArgTable) {
        args[argsStr[i]] = argsStr[i + 1]
    } else {
        exitWithError(`Invalid argument ${argsStr[i]}, use -h to get help.`)
    }
}

if (!args['-i']) {
    exitWithError('Invalid input path. Use -i to indicate.')
}
if (!args['--baseUrl']) {
    exitWithError('Invalid base url. Use --baseUrl to indicate.')
}
if (!args['-o']) {
    args['-o'] = 'data/rss.xml'
}
if (!args['--max']) {
    args['--max'] = '5'
}
if (!args['--url']) {
    args['--url'] = ''
}
if (!args['--title']) {
    args['--title'] = AppConfig.defaultTitle
}
if (!args['--description']) {
    args['--description'] = ''
}
if (!args['--creator']) {
    args['--creator'] = ''
}

const RSSHeader = `
    <rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
    <channel>
        <title><![CDATA[ ${args['--title']} ]]></title>
        <description><![CDATA[ ${args['--description']} ]]></description>
        <link>${args['--url']}</link>
        <generator>quick markdown</generator>
        <ttl>60</ttl>
`

const RSSTail = `</channel></rss>`

main()

async function main () {
    const metadata = JSON.parse(await fs.readFile(args['-i'], 'utf8'))
    metadata.sort((a, b) => a.frontMatter.time < b.frontMatter.time ? 1 : -1)
    const willBeOutput = metadata.slice(0, args['--max'])
    const postsRes = willBeOutput.reduce((pre, cur) => pre + `
        <item>
            <title><![CDATA[ ${cur.frontMatter.title} ]]></title>
            <description><![CDATA[ ${cur.frontMatter.abstract} ]]></description>
            <link>${args['--baseUrl']}?${cur.fileData.docPath}</link>
            <category><![CDATA[ ${cur.frontMatter.tags.join(' ')} ]]></category>
            <dc:creator><![CDATA[ ${args['--creator']} ]]></dc:creator>
            <pubDate>${new Date(cur.frontMatter.time).toUTCString()}</pubDate>
            <content:encoded><![CDATA[ ${cur.frontMatter.abstract} ]]></content:encoded>
        </item>
    `, '')

    const res = RSSHeader + postsRes + RSSTail
    writeFile(PathUtils.resolve(RootPath, args['-o']), res)
}

async function writeFile (mypath, str) {
    const dir = PathUtils.parse(mypath).dir
    try {
        await fs.access(dir)
    } catch (_) {
        fs.mkdir(dir)
    }
    await fs.writeFile(mypath, str)
}

function exitWithError (message) {
    console.error(message)
    process.exit(0)
}
