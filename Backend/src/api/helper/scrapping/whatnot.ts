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
            url: `https://www.whatnot.com/search?query=${url}`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            wait_for: "._pNjk",
            extract_rules: JSON.stringify({
                data: {
                    selector: '.MuiGrid-root.MuiGrid-container > div',
                    type: "list",
                    output: {
                        title: "div>a>div>div:nth-of-type(3)",
                        price: "div>a>div>div:nth-of-type(6)",
                        link: {
                            selector: ".phrZ0 img",
                            output: "@src"
                        },
                        url: {
                            selector: "div>a",
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
                        inv.url = `https://www.whatnot.com/${item.url}`
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