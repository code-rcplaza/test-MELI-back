const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { q } = req.query;
  const uri = encodeURI(`https://api.mercadolibre.com/sites/MLA/search?q=${q}`);

  try {
    const { author } = req;
    const { data } = await axios.get(uri);

    const { results, filters, query } = data;

    const items = results.map((item) => {
      return {
        id: item.id,
        title: item.title,
        price: {
          currency: item.address.state_name,
          amount: item.price,
          decimals: 0,
        },
        picture: item.thumbnail,
        condition: item.attributes.find(
          (attribute) => attribute.id === "ITEM_CONDITION"
        ).value_name,
        free_shipping: item.shipping.free_shipping,
      };
    });

    let categories = [];
    if (filters.length > 0) {
      categories = filters
        .find((filter) => filter.id === "category")
        .values.find((path) => path.path_from_root)
        .path_from_root.map((path) => path.name);
    } else {
      categories = [q];
    }

    res.send({ author, categories, items });
  } catch (err) {
    console.error("Huston we have a problem", err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const firstUri = encodeURI(`https://api.mercadolibre.com/items/${id}`);
  const secondUri = encodeURI(
    `https://api.mercadolibre.com/items/${id}/description`
  );

  try {
    const { author } = req;
    const rawItem = await axios.get(firstUri);
    const rawDescription = await axios.get(secondUri);

    const item = {
      id: rawItem.data.id,
      title: rawItem.data.title,
      price: {
        currency: rawItem.data.currency_id,
        amount: rawItem.data.price,
        decimals: 0,
      },
      picture: rawItem.data.thumbnail,
      condition: rawItem.data.attributes.find(
        (attribute) => attribute.id === "ITEM_CONDITION"
      ).value_name,
      free_shipping: rawItem.data.shipping.free_shipping,
      sold_quantity: rawItem.data.sold_quantity,
      description: rawDescription.data.plain_text,
    };
    res.send({ author, item });
  } catch (err) {
    console.error("Huston we have a problem", err);
  }
});

module.exports = router;
