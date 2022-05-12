const fs = require('fs-extra')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let hadithLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
let extensions = [".min.json", ".json"]
let bigJSON = {}

async function test() {

    let editionsJSON = await getJSON('editions')
    let isocodes = await getJSON('isocodes/iso-codes', quranLinks)
    let infoJSON = await getJSON('info')

    let hadithPath = path.join(__dirname, 'docs','Hadiths')
    let quranPath = path.join(__dirname, 'docs','Quran')

    for (let [bareedition, value] of Object.entries(editionsJSON)) {
        for (let collection of editionsJSON[bareedition].collection.sort((a,b)=>a.language.localeCompare(b.language))) {

            let edition = collection.name;
            let lang = collection.language;
            let dirval = collection.direction;


            let data = await getJSON(`editions/${edition}`)
            let languageHeading = `## ${lang}`

            let hadiths = data.hadiths

            for (let hadith of hadiths) {
                let pathToSave = path.join(hadithPath,editionsJSON[bareedition].name,`${capitalize(bareedition)} - ${Math.floor(hadith.hadithnumber)}.mdx`)
                let dataToSave = getHadithCardElem(hadith, edition, dirval, lang, isocodes)
                // save language if doesn't exists
                if(Array.isArray(bigJSON[pathToSave]) && !bigJSON[pathToSave].includes(languageHeading))
                addToBigJSON(pathToSave, languageHeading )

                addToBigJSON(pathToSave, dataToSave )
                break
            }
            

        }
        
    }

    for(let [pathToSave, dataArr] of Object.entries(bigJSON)){
        fs.outputFileSync(pathToSave, dataArr.join('\n\n'))
    }

}

test()


// pass hadith object & get card element with all hadith info in it
function getHadithCardElem(hadith, editionName, dirval, lang, isocodes) {
    let str = ''
    let lowerLang = lang.toLowerCase()
    str += `<div dir="${dirval}" lang="${isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2}" style={{fontSize:'larger',backgroundColor:'#f8f9fa',padding:20}}>${(hadith.text).replace(/`/gi,"'")}</div>`
    str+=`<div style={{backgroundColor:'#f8f9fa',padding:20}}>`
    if (hadith.grades.length > 0) {
        str += `<table>
      <thead>
        <tr>
          <th>Grade</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
`
    }

    for (let grade of hadith.grades)
        str += `<tr><td>${capitalize(grade.grade)}</td><td>${grade.name}</td></tr>`

    if (hadith.grades.length > 0)
        str += `</tbody></table>`


    if ("hadithnumber" in hadith) {
        str += `<table>
        <thead>
          <tr>
            <th>References:</th>
            <th></th>
          </tr>
        </thead>
        <tbody>`
        str += `<tr><td>Hadith No</td><td>${hadith.hadithnumber}</td></tr>`
    }
    if ("arabicnumber" in hadith) {
        str += `<tr><td>Arabic No</td><td>${hadith.arabicnumber}</td></tr>`
    }

    if ("reference" in hadith) {
        str += `<tr><td>Reference</td><td>${Object.entries(hadith.reference).flat().map(e => capitalize(e)).join(' ')}</td></tr>`
    }
    str += `</tbody></table></div>`

    return str + '\n'
}


function capitalize(words) {
    return words.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()).trim()
}

function addToBigJSON(key, value) {

    if(key in bigJSON)
        bigJSON[key].push(value)
    else
        bigJSON[key] = [value]

}

// https://www.shawntabrizi.com/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
// Get links async i.e in parallel
async function getJSON(endpoints, links) {
    let returnSingle = false
    if (!Array.isArray(endpoints)) {
        endpoints = [endpoints]
        returnSingle = true
    }
    let result = await Promise.all(
        endpoints.map(endpoint => fetchWithFallback(getURLs(endpoint, links)).then(response => response.json()))
    ).catch(console.error)
    if (returnSingle)
        return result[0]
    return result
}


async function fetchWithFallback(links, obj) {
    let response;
    for (let link of links) {
        try {
            response = await fetch(link, obj)
            if (response.ok)
                return response
        } catch (e) { }
    }
    return response
}

// convert endpoint into multiple urls, including fallback urls
function getURLs(endpoint, links) {
    links = links || hadithLinks
    return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}