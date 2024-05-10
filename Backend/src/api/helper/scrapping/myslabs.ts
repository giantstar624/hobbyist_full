import axios from 'axios'
class Scrapping {
    public PriceToStr(price: string) {
        if (!price) return 0
        return parseFloat(price.replace(" ","").slice(1).replace(",", ""))
    }
    public async getScrappingData(search_word, id) {
        const url = search_word.replace(" ","+")
        const params = {
            api_key:
                "DCXO8PT2BDINHZNQDJUMHLK9FYAKG3MDW9U4T1A4G7KNZ4IN7WNYA796GELUFA1KW9VQ7R9ZXSXN28IH",
            url: `https://myslabs.com/search/slabs/?publish_type=0&owner=&q=${url}&o=created_desc`,
            // Wait for there to be at least one
            // non-empty .event-tile element
            // wait: 10000,
            wait_for: ".padded-primary-container",
            extract_rules: JSON.stringify({
                data: {
                    selector: ".padded-primary-container .slab_item",
                    type: "list",
                    output: {
                        title: ".slab-title",
                        price: ".slab-price",
                        link: {
                            selector: ".slab_item_img_inside img",
                            output: "@data-src",
                        },
                        url: {
                            selector: ".slab_item_img_inside a",
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
                        inv.url = `https://www.myslabs.com${item.url}`
                        if (id == null) inv.category = search_word
                        inv.item = id
                    }
                    // if(inv.price>0)
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