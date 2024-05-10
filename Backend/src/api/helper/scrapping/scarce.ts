import axios from 'axios'
class Scrapping {
    public scarcePriceToStr(price:string) {
        if(!price) return 0
        return parseFloat(price.slice(3).replace(",", ""))
    }
    public async getScrappingData(search_word, id) {
        const url = search_word.split(" ").join("+")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://scarce.co/search?q=${url}&sort_by=relevance`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            wait_for: "dynamic-product-search",
            extract_rules: JSON.stringify({
                data: {
                    selector: "product-card",
                    type: "list",
                    output: {
                        price: ".price__number",
                        title: ".product-card__title",
                        link: {
                            selector: ".product-card__img",
                            output: "@src",
                        },
                        url: {
                            selector: ".product-card__link",
                            output: "@href"
                        }
                    }
                },

                next_page: {
                    "selector": ".next a",
                    "output": "@href"
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
                        price: this.scarcePriceToStr(item.price),
                        title: item.title,
                    };
                    if (item.link) {
                        inv.link = `https:${item.link}`;
                        inv.baseCurrency = "AU$";
                        inv.date = new Date();
                        inv.url = `https://scarce.co${item.url}`
                        if (id == null) inv.category = search_word
                        inv.item = id
                    }
                    invs.push(inv);
                }
            });
            return invs.slice(0,100);
        } catch (error) {
            return []
        }
    }
}
export default Scrapping