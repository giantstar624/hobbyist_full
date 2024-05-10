import axios from 'axios'
class Scrapping {
    public PriceToStr(price: string) {
        if (!price) return 0
        return parseFloat(price.slice(4).replace(",", ""))
    }
    public async getScrappingData(search_word, id) {
        const url = search_word
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://www.abebooks.com/servlet/SearchResults?kn=${url}&sts=t&cm_sp=SearchF-_-topnav-_-Results`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            wait_for: "#main",
            render_js: false,
            extract_rules: JSON.stringify({
                data: {
                    selector: '#srp-results li',
                    type: "list",
                    output: {
                        title: 'span[data-cy="listing-title"]',
                        price: ".item-price",
                        link: {
                            selector: ".srp-item-image",
                            output: "@src"
                        },
                        url: {
                            selector: "h2.title a",
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
                        inv.url = `https://www.abebooks.com${item.url}`
                        if (id == null) inv.category = search_word
                        inv.item = id
                    }
                    invs.push(inv);
                }
            });
            return invs;
        } catch (error) {
            return []
        }
    }
}
export default Scrapping