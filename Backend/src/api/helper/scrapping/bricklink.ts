import axios from 'axios'
class Scrapping {
    public PriceToStr(price: string) {
        if (!price) return 0
        price = price.replace(" ","").replace("+","")
        if(price=="-") return 0
        let i = 0
        for(i=0;i<price.length;i++)
            if(price[i]>='0' && price[i]<='9') break
        return [price.slice(0,i),parseFloat(price.slice(i).replace(",",""))]
    }
    public async getScrappingData(search_word, id) {
        const url = search_word
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
                if (item) {
                    const data = this.PriceToStr(item.price)
                    const inv: any = {
                        price: data[1],
                        title: item.title,
                    };
                    if (item.link) {
                        inv.link = `https:${item.link}`
                        inv.baseCurrency = data[0];
                        inv.date = new Date();
                        inv.url = `https://www.bricklink.com${item.url}`
                        if (id == null) inv.category = search_word
                        inv.item = id
                    }
                    if(inv.price>0)
                        invs.push(inv);
                }
            });
            return invs;
        } catch (error) {
            console.log(error)
            return []
        }
    }
}
export default Scrapping