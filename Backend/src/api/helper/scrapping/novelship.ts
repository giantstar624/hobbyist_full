import axios from 'axios'
class Scrapping {
    public PriceToStr(price: string) {
        if (!price) return 0
        return parseFloat(price.slice(4).replace(",", ""))
    }
    public async getScrappingData(search_word, id) {
        const url = search_word.split(" ").join("+")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://novelship.com/browse?q=${url}`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            // wait_for: "section.sc-Arkif",
            wait: 3000,
            // wait_for: "section.sc-Arkif",
            extract_rules: JSON.stringify({
                data: {
                    selector: ".injXPf a",
                    type: "list",
                    output: {
                        title: ".sc-bdnxRM.cBnPhc.sc-pNWdM.koHcdZ.ls02.lh14",
                        price: ".sc-bdnxRM.frySFC.sc-pNWdM",
                        link: {
                            selector: ".sc-bdnxRM.iksxLl.contain",
                            output: "@src"
                        },
                        url: {
                            selector: "a",
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
                if (item) {
                    const inv: any = {
                        price: this.PriceToStr(item.price),
                        title: item.title,
                    };
                    if (item.link) {
                        inv.link = item.link;
                        inv.baseCurrency = item.price.split(" ")[0];
                        inv.date = new Date();
                        inv.url = `https://novelship.com${item.url}`
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