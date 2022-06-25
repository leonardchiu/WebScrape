//Dependencies

const axios = require('axios');
const cheerio = require('cheerio');
const HttpsProxyAgent = require('https-proxy-agent');
require("dotenv").config();
const accessKey = process.env.ACCESS_KEY;

const messagebird = require('messagebird')(accessKey);

const url = "https://store.sony.com.sg/collections/playstation-consoles/products/playstation-5-bundle";

const product = {name: "", status: "", link: "", };

//Set interval of 5mins to run
const handle = setInterval(scrape, 300000);

async function scrape() {
    const {data} = await axios.get(url);
    //Load html into cheerio
    const $ = cheerio.load(data);
    const item = $("div.product__details");
    product.name = $(item).find("h1.product__title").text();
    
    product.link = url;

    //product.price = $(item)
    //    .find("div span.product__price")
    //    .text()
    //    .replace(/[$]/g, "");

    product.status = $(item)
    .find("button.product__add-to-cart")
    .text()
    .trim();

    //const priceNum = parseInt(product.price);
    const params = {
        'originator': 'PS5',
        'recipients': ['+6597889999'],
        'body': `PS5 back in stock! Visit ${product.link} now!`
    };
    
    console.log(product);

    if(product.status !== "Out Of Stock"){
        // console.log("NO LUCK!");
        messagebird.messages.create(params, function (err, response) {
           if (err) {
             return console.log(err);
           }
           console.log(response);
           clearInterval(handle);
         });
    };
    var now = new Date();
    console.log(now.toLocaleDateString() + " - " +  now.toLocaleTimeString() + " - NO LUCK! TRY AGAIN");

}

scrape();