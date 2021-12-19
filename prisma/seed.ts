import axios from 'axios';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const url = new URL('https://search.nintendo-europe.com/ru/select');
  const params = {
    fq: 'type:GAME AND system_type:nintendoswitch* AND product_code_txt:*',
    q: '*',
    sort: 'sorting_title asc',
    start: '0',
    wt: 'json',
    rows: '9999',
  };

  url.search = new URLSearchParams(params).toString();

  const response = await axios.get(url.toString());
  const games = response.data.response.docs;
  for (const game of games) {
    console.log(game.product_code_ss[0]);
    await prisma.game.upsert({
      where: { id: game.product_code_ss[0] },
      update: {},
      create: {
        id: game.product_code_ss[0],
        title: game.title.trim(),
        description: game.excerpt.trim(),
        price: game.price_regular_f,
        image: game.image_url_sq_s,
        cover: game.image_url_h2x1_s.replace('image500w', 'image1600w'),
        rating: game.age_rating_sorting_i,
        prettyRating: game.pretty_agerating_s,
        url: game.url,
        hasDemo: game.demo_availability,
        hasDigitalVersion: game.digital_version_b,
        hasPhysicalVersion: game.physical_version_b,
        publisher: game.publisher?.trim(),
        dateReleased: game.date_from,
        prettyDateReleased: game.pretty_date_s,
        dateUpdated: game.change_date,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
