import axios from 'axios'
import { logger } from '../../config/logger';
class Scrapping {
    public PriceToStr(price: string) {
        price = price.replace(/ /g, "").replace(/,/g, "")
        let i = 0
        for (i = 0; i < price.length; i++)
            if (price[i] >= '0' && price[i] <= '9')
                break;
        if (i == price.length || isNaN(parseFloat(price.slice(i))))
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
        const url = search_word.split(" ").map(val=>encodeURIComponent(val)).join("+")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://brickowl.com/search/catalog?query=${url}`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            wait_for: ".category-grid",
            extract_rules: JSON.stringify({
                data: {
                    selector: ".category-item",
                    type: "list",
                    output: {
                        title: ".category-item-name",
                        price: ".price-box .price",
                        link: {
                            selector: ".category-item-image img",
                            output: "@src"
                        },
                        url: {
                            selector: ".category-item-name a",
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

            const invs: any[] = [];

            await response.map(async (item) => {
                const data = this.PriceToStr(item.price)
                if (data.currency != 'No') {
                    item.link = item.link;
                    item.baseCurrency = data.currency;
                    item.price = data.price
                    item.date = new Date();
                    item.url = `https://brickowl.com${item.url}`
                    if (id == null) item.category = search_word
                    item.item = id
                    invs.push(item);
                }
            });
            logger.info(`brickowl complete with ${invs.length}`)
            return invs;
        } catch (error) {
            logger.error(`brickowl ${error}`)
            return []
        }
    }
}
export default Scrapping