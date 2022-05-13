const fs = require('fs-extra')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let hadithLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
let extensions = [".min.json", ".json"]
let bigJSON = {}

const chaptersJSON = { 'Al-Faatiha': 'The Opening', 'Al-Baqara': 'The Cow', 'Aal-i-Imraan': 'The Family of Imraan', 'An-Nisaa': 'The Women', 'Al-Maaida': 'The Table', "Al-An'aam": 'The Cattle', "Al-A'raaf": 'The Heights', 'Al-Anfaal': 'The Spoils of War', 'At-Tawba': 'The Repentance', Yunus: 'Jonas', Hud: 'Hud', Yusuf: 'Joseph', "Ar-Ra'd": 'The Thunder', Ibrahim: 'Abraham', 'Al-Hijr': 'The Rock', 'An-Nahl': 'The Bee', 'Al-Israa': 'The Night Journey', 'Al-Kahf': 'The Cave', Maryam: 'Mary', 'Taa-Haa': 'Taa-Haa', 'Al-Anbiyaa': 'The Prophets', 'Al-Hajj': 'The Pilgrimage', 'Al-Muminoon': 'The Believers', 'An-Noor': 'The Light', 'Al-Furqaan': 'The Criterion', "Ash-Shu'araa": 'The Poets', 'An-Naml': 'The Ant', 'Al-Qasas': 'The Stories', 'Al-Ankaboot': 'The Spider', 'Ar-Room': 'The Romans', Luqman: 'Luqman', 'As-Sajda': 'The Prostration', 'Al-Ahzaab': 'The Clans', Saba: 'Sheba', Faatir: 'The Originator', Yaseen: 'Yaseen', 'As-Saaffaat': 'Those drawn up in Ranks', Saad: 'The letter Saad', 'Az-Zumar': 'The Groups', Ghafir: 'The Forgiver', Fussilat: 'Explained in detail', 'Ash-Shura': 'Consultation', 'Az-Zukhruf': 'Ornaments of gold', 'Ad-Dukhaan': 'The Smoke', 'Al-Jaathiya': 'Crouching', 'Al-Ahqaf': 'The Dunes', Muhammad: 'Muhammad', 'Al-Fath': 'The Victory', 'Al-Hujuraat': 'The Inner Apartments', Qaaf: 'The letter Qaaf', 'Adh-Dhaariyat': 'The Winnowing Winds', 'At-Tur': 'The Mount', 'An-Najm': 'The Star', 'Al-Qamar': 'The Moon', 'Ar-Rahmaan': 'The Beneficent', 'Al-Waaqia': 'The Inevitable', 'Al-Hadid': 'The Iron', 'Al-Mujaadila': 'The Pleading Woman', 'Al-Hashr': 'The Exile', 'Al-Mumtahana': 'She that is to be examined', 'As-Saff': 'The Ranks', "Al-Jumu'a": 'Friday', 'Al-Munaafiqoon': 'The Hypocrites', 'At-Taghaabun': 'Mutual Disillusion', 'At-Talaaq': 'Divorce', 'At-Tahrim': 'The Prohibition', 'Al-Mulk': 'The Sovereignty', 'Al-Qalam': 'The Pen', 'Al-Haaqqa': 'The Reality', "Al-Ma'aarij": 'The Ascending Stairways', Nooh: 'Noah', 'Al-Jinn': 'The Jinn', 'Al-Muzzammil': 'The Enshrouded One', 'Al-Muddaththir': 'The Cloaked One', 'Al-Qiyaama': 'The Resurrection', 'Al-Insaan': 'Man', 'Al-Mursalaat': 'The Emissaries', 'An-Naba': 'The Announcement', "An-Naazi'aat": 'Those who drag forth', Abasa: 'He frowned', 'At-Takwir': 'The Overthrowing', 'Al-Infitaar': 'The Cleaving', 'Al-Mutaffifin': 'Defrauding', 'Al-Inshiqaaq': 'The Splitting Open', 'Al-Burooj': 'The Constellations', 'At-Taariq': 'The Morning Star', "Al-A'laa": 'The Most High', 'Al-Ghaashiya': 'The Overwhelming', 'Al-Fajr': 'The Dawn', 'Al-Balad': 'The City', 'Ash-Shams': 'The Sun', 'Al-Lail': 'The Night', 'Ad-Dhuhaa': 'The Morning Hours', 'Ash-Sharh': 'The Consolation', 'At-Tin': 'The Fig', 'Al-Alaq': 'The Clot', 'Al-Qadr': 'The Power, Fate', 'Al-Bayyina': 'The Evidence', 'Az-Zalzala': 'The Earthquake', 'Al-Aadiyaat': 'The Chargers', "Al-Qaari'a": 'The Calamity', 'At-Takaathur': 'Competition', 'Al-Asr': 'The Declining Day, Epoch', 'Al-Humaza': 'The Traducer', 'Al-Fil': 'The Elephant', Quraish: 'Quraysh', "Al-Maa'un": 'Almsgiving', 'Al-Kawthar': 'Abundance', 'Al-Kaafiroon': 'The Disbelievers', 'An-Nasr': 'Divine Support', 'Al-Masad': 'The Palm Fibre', 'Al-Ikhlaas': 'Sincerity', 'Al-Falaq': 'The Dawn', 'An-Naas': 'Mankind' };
const arabicChapters = Object.keys(chaptersJSON).map(e=>e.replace("'",""))
const englishChapters = Object.values(chaptersJSON)

async function test() {

    let editionsJSON = await getJSON('editions')
    let quranEditionsJSON = await getJSON('editions', quranLinks)
    let isocodes = await getJSON('isocodes/iso-codes', quranLinks)

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
                let dataToSave = getHadithCardElem(hadith, dirval, lang, isocodes)
                // save language if doesn't exists
                if(pathToSave in bigJSON === false ||  !bigJSON[pathToSave].includes(languageHeading))
                addToBigJSON(pathToSave, languageHeading )

                addToBigJSON(pathToSave, dataToSave )
            }
            

        }
        
    }
    
    for (let value of Object.values(quranEditionsJSON).sort((a,b)=>a.language.localeCompare(b.language))) {
        let data = await getJSON(`editions/${value.name}`, quranLinks)
        let languageHeading = `## ${value.language}`

        for(let quran of data.quran){
            let chapterName = `Chapter ${quran.chapter} ${arabicChapters[quran.chapter - 1]}`
            let pathToSave = path.join(quranPath,chapterName,`${arabicChapters[quran.chapter - 1]} Verse ${quran.verse}.mdx`)
            let dataToSave =  getQuranCardElem(quran, value.direction, value.language,value.author, isocodes) 
                            // save language if doesn't exists
                            if(pathToSave in bigJSON === false || !bigJSON[pathToSave].includes(languageHeading))
                            addToBigJSON(pathToSave, languageHeading )
            
                            addToBigJSON(pathToSave, dataToSave )
                            
        }




    }

    let filteredKeys = Object.keys(bigJSON).filter(e=>e.includes('Quran'))

    for(let pathToSave of filteredKeys){
        fs.outputFileSync(pathToSave, bigJSON[pathToSave].join('\n\n'))
    }

}

test()


// pass hadith object & get card element with all hadith info in it
function getHadithCardElem(hadith, dirval, lang, isocodes) {
    let str = ''
    let lowerLang = lang.toLowerCase()
    str += `<div dir="${dirval}" lang="${isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2}" style={{fontSize:'larger',backgroundColor:'#f8f9fa',padding:20}}>${(hadith.text).replace(/`/gi,"'")}</div>`
    str+=`<div style={{backgroundColor:'#f8f9fa',padding:20, marginBottom: 10}}>`
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

    return str
}


// pass hadith object & get card element with all hadith info in it
function getQuranCardElem(quran, dirval, lang,authorName, isocodes) {
    let str = ''
    let lowerLang = lang.toLowerCase()
    str += `<div dir="${dirval}" lang="${isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2}" style={{fontSize:'larger',backgroundColor:'#f8f9fa',padding:20}}>${(quran.text).replace(/`/gi,"'")}</div>`
    str+=`<div style={{backgroundColor:'#f8f9fa',padding:20, marginBottom: 10}}>`

        str += `<table>
      <thead>
        <tr>
          <th>Details</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
`
    

        str += `<tr><td>Author</td><td>${authorName}</td></tr>`

        str += `</tbody></table></div>`

    return str
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