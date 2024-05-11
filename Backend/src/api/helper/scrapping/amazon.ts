import axios from 'axios'
class Scrapping {
    public PriceToStr(price: string) {
        if (!price) return 0
        return parseFloat(price.slice(1).replace(",", ""))
    }
    public async getScrappingData(search_word, id) {
        const url = search_word.split(" ").join("+")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://www.amazon.com/s?k=${url}`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            // wait: 10000,
            wait_for: ".s-main-slot",
            extract_rules: JSON.stringify({
                data: {
                    selector: '.s-main-slot div[data-component-type="s-search-result"]',
                    type: "list",
                    output: {
                        title: 'h2',
                        price: {
                            selector: 'div[data-cy="price-recipe"] .a-price>span',
                            output: "text"
                        },
                        link: {
                            selector: ".s-product-image-container img",
                            output: "@src"
                        },
                        url: {
                            selector: ".s-product-image-container a",
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
                if (item) {
                    const inv: any = {
                        price: this.PriceToStr(item.price),
                        title: item.title,
                    };
                    if (item.link) {
                        inv.link = item.link
                        inv.baseCurrency = "$";
                        inv.date = new Date();
                        inv.url = `https://www.amazon.com${item.url}`
                        if (id == null) inv.category = search_word
                        inv.item = id
                    }
                    if(inv.price>0)
                        invs.push(inv);
                }
            });
            return invs;
        } catch (error) {
            // console.log(error)
            return []
        }
    }
}
export default Scrapping