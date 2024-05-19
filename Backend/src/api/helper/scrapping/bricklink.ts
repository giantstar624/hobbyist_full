import axios from 'axios'
import { logger } from '../../config/logger';
class Scrapping {
    public PriceToStr(price: string) {
        price = price.replace(/ /g, "").replace(/,/g, "")
        let i = 0
        for (i = 0; i < price.length; i++)
            if (price[i] >= '0' && price[i] <= '9')
                break;
        if (i == price.length)
            return {
                currency: 'No',
                price: 0
            }
        return {
            currency: price.slice(0, i),
            price: parseFloat(price.slice(i))
        }
    }
    public async getScrappingData(search_word, id) {
        const url = search_word.split(" ").map(val=>encodeURIComponent(val)).join(" ")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://www.bricklink.com/v2/search.page?q=${url}#T=A`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            wait: 500,
            // wait_for: "#_idContentsTabA",
            block_resources: false,
            // block_ads: false,
            // render_js: true,
            extract_rules: JSON.stringify({
                data: {
                    selector: '#_idContentsTabA>div[id*="_idItemTableFor"] tr.pspItemTypeContentsNew',
                    type:"list",
                    output: {
                        title: ".pspItemNameLink",
                        price: "td:last-child",
                        link: {
                            selector : "img",
                            output: "@src"
                        },
                        url: {
                            selector: ".pspItemNameLink",
                            output: "@href"
                        }
                    }
                }
            }),
        }
        try {
            const { data } = await axios.get("https://app.scrapingbee.com/api/v1/", {
                params: params
            });

            const response = data.data;
            // console.log(response)
            const invs: any[] = [];

            await response.map(async (item) => {
                const data = this.PriceToStr(item.price)
                if (data.currency != 'No') {
                    item.link = `https:${item.link}`
                    item.baseCurrency = data.currency;
                    item.price = data.price
                    item.date = new Date();
                    item.url = `https://www.bricklink.com${item.url}`
                    if (id == null) item.category = search_word
                    item.item = id
                    invs.push(item);
                }
            });
            return invs;
        } catch (error) {
            logger.error(`bricklink ${error.response.data.message}`)
            return []
        }
    }
}
export default Scrapping